import { OPENAI_API_HOST, OPENAI_API_TYPE, OPENAI_API_VERSION, OPENAI_ORGANIZATION } from '@/utils/app/const';

import { getDataSource, getUser } from '@/utils/server/rdbms';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

import { OpenAIModel, OpenAIModelID, OpenAIModels } from '@/types/openai';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'User is not authenticated' });
  } else if (!session.user) {
    return res.status(401).json({ error: 'User is not authenticated' });
  } else if (!session.user.email) {
    return res
      .status(401)
      .json({ error: 'User does not have an email address' });
  }
  const userId = session.user.email;

  const dataSource = await getDataSource();
  const user = await getUser(dataSource, userId);

  const user_model_list = user.allowed_models;
  
  if (user_model_list === null || user_model_list.length === 0) {
    // return gpt-3.5-turbo as default
    const default_fallback = [{
      id: OpenAIModelID.GPT_3_5,
      name: OpenAIModels[OpenAIModelID.GPT_3_5].name
    }];
    return res.status(200).json(default_fallback);
  }

  const allowed_models = user_model_list.map((model: string) => {
    return {
      id: model,
      name: OpenAIModels[model as OpenAIModelID].name
    }
  });

  
  return res.status(200).json(allowed_models);

  
};

export default handler;
