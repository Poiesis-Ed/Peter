import { getRepository } from "typeorm";
import { RDBMSUser } from "../types/rdbms";
//import { RDBMSUser } from "./rdbmsUser";


export async function updateModelAccess() {
    const userRepository = getRepository(RDBMSUser);
    const users = await userRepository.find();
  
    // Parse the privileged users from the environment variable
    const privilegedUsers = process.env.PRIVILEGED_USERS.split(",");
    
    // Parse the global gpt-4 toggle from the environment variable
    const globalGpt4Toggle = process.env.GLOBAL_GPT4_TOGGLE === "true";
  
    for (const user of users) {
      // If the user is privileged, they always have access to gpt-4
      if (privilegedUsers.includes(user.id)) {
        if (!user.accessibleModels.includes("gpt-4")) {
          user.accessibleModels.push("gpt-4");
        }
      } 
      // For other users, their access depends on the global toggle
      else if (globalGpt4Toggle && !user.accessibleModels.includes("gpt-4")) {
        user.accessibleModels.push("gpt-4");
      } else if (!globalGpt4Toggle && user.accessibleModels.includes("gpt-4")) {
        const index = user.accessibleModels.indexOf("gpt-4");
        user.accessibleModels.splice(index, 1);
      }
  
      // All users have access to gpt-3.5-turbo-16k by default
      if (!user.accessibleModels.includes("gpt-3.5-turbo-16k")) {
        user.accessibleModels.push("gpt-3.5-turbo-16k");
      }
    }
  
    // Save all modified users at once
    await userRepository.save(users);
}
