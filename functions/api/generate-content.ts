import Anthropic from '@anthropic-ai/sdk';
import type { GuideData, GenerateContentRequest, GenerateContentResponse } from '../../src/types';
import { detectContentType, extractGameName } from '../../src/utils/contentDetection';
import { slugify, generateId, generateKVKey } from '../../src/utils/slugify';
import { getSystemPrompt, getUserPrompt } from '../config/prompts';

interface Env {
    ANTHROPIC_API_KEY: string;
    GUIDES_KV: KVNamespace;
    METADATA_KV: KVNamespace;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    try {
        // Parse request body
        const body = await request.json() as GenerateContentRequest;
        const { query, forceRegenerate = false } = body;

        if (!query || query.trim().length === 0) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: 'Query é obrigatória',
                } as GenerateContentResponse),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        // Detecta tipo de conteúdo e extrai nome do jogo
        const contentType = detectContentType(query);
        const gameName = extractGameName(query);
        const slug = slugify(query);

        console.log('Detecção:', { query, contentType, gameName, slug });

        // Verifica cache no KV (se não forçar regeneração)
        if (!forceRegenerate) {
            const cachedGuide = await env.GUIDES_KV.get(`slug:${slug}`);
            if (cachedGuide) {
                console.log('Cache HIT:', slug);
                return new Response(
                    JSON.stringify({
                        success: true,
                        data: JSON.parse(cachedGuide),
                        cached: true,
                        slug,
                    } as GenerateContentResponse),
                    {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' },
                    }
                );
            }
        }

        console.log('Cache MISS, gerando conteúdo...');

        // Inicializa Claude API
        const anthropic = new Anthropic({
            apiKey: env.ANTHROPIC_API_KEY,
        });

        // Prepara prompts
        const systemPrompt = getSystemPrompt();
        const userPrompt = getUserPrompt(contentType, query, gameName || query);

        // Chama Claude API
        const message = await anthropic.messages.create({
            model: 'claude-3-5-haiku-20241022',
            max_tokens: 3000,
            temperature: 0.7,
            system: systemPrompt,
            messages: [
                {
                    role: 'user',
                    content: userPrompt,
                },
            ],
        });

        // Extrai conteúdo da resposta
        const responseText = message.content[0].text;
        console.log('Resposta da IA recebida, parseando JSON...');

        // Parse JSON (remove markdown se existir)
        let guideData: Partial<GuideData>;
        try {
            const jsonMatch = responseText.match(/```json\n?([\s\S]*?)\n?```/) ||
                responseText.match(/```\n?([\s\S]*?)\n?```/);
            const jsonString = jsonMatch ? jsonMatch[1] : responseText;
            guideData = JSON.parse(jsonString.trim());
        } catch (parseError) {
            console.error('Erro ao parsear JSON:', parseError);
            return new Response(
                JSON.stringify({
                    success: false,
                    error: 'Erro ao processar resposta da IA',
                } as GenerateContentResponse),
                {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        // Adiciona metadados
        const id = generateId();
        const now = new Date().toISOString();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 dias

        const fullGuide: GuideData = {
            id,
            slug,
            type: contentType,
            game: gameName || guideData.game || query,
            title: guideData.title || `Guia de ${query}`,
            subtitle: guideData.subtitle || '',
            metaDescription: guideData.metaDescription || '',
            content: guideData.content || '',
            readTime: guideData.readTime || 5,
            difficulty: guideData.difficulty || 'medio',
            tags: guideData.tags || [],
            imageUrl: '', // Será preenchido depois com Unsplash
            imageQuery: guideData.imageQuery || query,
            codes: guideData.codes,
            steps: guideData.steps,
            tips: guideData.tips,
            commonMistakes: guideData.commonMistakes,
            tierList: guideData.tierList,
            build: guideData.build,
            counters: guideData.counters,
            views: 0,
            createdAt: now,
            updatedAt: now,
            expiresAt,
        };

        // Salva no KV
        const kvKey = generateKVKey(contentType, gameName || query, id);

        await Promise.all([
            // Salva por chave principal
            env.GUIDES_KV.put(kvKey, JSON.stringify(fullGuide), {
                expirationTtl: 7 * 24 * 60 * 60, // 7 dias
                metadata: {
                    game: fullGuide.game,
                    category: contentType,
                    createdAt: now,
                    views: 0,
                },
            }),
            // Salva por slug (para busca rápida)
            env.GUIDES_KV.put(`slug:${slug}`, JSON.stringify(fullGuide), {
                expirationTtl: 7 * 24 * 60 * 60,
            }),
        ]);

        // Adiciona à lista de guias recentes
        try {
            const recentKey = 'recent:guides';
            let recentGuides: any[] = [];

            const recentData = await env.METADATA_KV.get(recentKey);
            if (recentData) {
                recentGuides = JSON.parse(recentData);
            }

            recentGuides.unshift({
                slug,
                title: fullGuide.title,
                game: fullGuide.game,
                category: contentType,
                createdAt: now,
            });

            // Mantém apenas os 50 mais recentes
            recentGuides = recentGuides.slice(0, 50);

            await env.METADATA_KV.put(recentKey, JSON.stringify(recentGuides));
        } catch (error) {
            console.error('Erro ao atualizar lista de recentes:', error);
            // Não falha a requisição por causa disso
        }

        console.log('Guia salvo com sucesso:', kvKey);

        return new Response(
            JSON.stringify({
                success: true,
                data: fullGuide,
                cached: false,
                slug,
            } as GenerateContentResponse),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error) {
        console.error('Erro ao gerar conteúdo:', error);

        return new Response(
            JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'Erro desconhecido',
            } as GenerateContentResponse),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
};
