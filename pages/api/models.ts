import { OPENAI_API_HOST, OPENAI_API_TYPE, OPENAI_API_VERSION, OPENAI_ORGANIZATION } from '@/utils/app/const';

import { OpenAIModel, OpenAIModelID, OpenAIModels } from '@/types/openai';

export const config = {
  runtime: 'edge',
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { key } = (await req.json()) as {
      key: string;
    };

    const hardcodedModelId = 'gpt-3.5-turbo'; // Hardcoded model id
    const hardcodedModel = {
      id: hardcodedModelId,
      name: OpenAIModels[hardcodedModelId].name
    };

    return new Response(JSON.stringify([hardcodedModel]), { status: 200 }); // Directly return hardcoded model
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
};

export default handler;
