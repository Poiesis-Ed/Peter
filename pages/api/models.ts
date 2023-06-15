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

  const allowed_models = user.allowed_models;
  
  if (!allowed_models) {
    return res.status(418).json({ error: 'User does not have any allowed models' });
  }
  
  const allowedModels: OpenAIModel[] = allowed_models.map((modelID: string) => {
    return OpenAIModels[modelID as OpenAIModelID];
  });

  return res.status(200).json({ allowedModels });

  
};

export default handler;
