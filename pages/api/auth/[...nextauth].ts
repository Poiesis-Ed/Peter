import NextAuth, { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import AzureAdProvider from 'next-auth/providers/azure-ad';

const providers = [];
if (process.env.GOOGLE_CLIENT_ID) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,

      // Needed to be able to select a different google accounts each time.
      authorization: {
        params: {
          prompt: 'login',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  );
}
if (process.env.GITHUB_CLIENT_ID) {
  providers.push(
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  );
}
if (process.env.AZURE_CLIENT_ID) {
  providers.push(
    AzureAdProvider({
      clientId: process.env.AZURE_CLIENT_ID!,
      clientSecret: process.env.AZURE_CLIENT_SECRET!,
      tenantId: process.env.AZURE_TENANT_ID!,
    }),
  );
}

export const authOptions: NextAuthOptions = {
  providers: providers,
  session: { strategy: 'jwt' },
};

export default NextAuth(authOptions);
