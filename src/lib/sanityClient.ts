import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "8zihpsao",  
  dataset: "production",
  useCdn: false, 
  apiVersion: "2025-08-18",
  token: "sknkSumpbNsQ7bLo0ZJmn5kvFw5ynnjvZTfB8DGjNr2RYZKGpHP3kP7vq4LgR5zB5UCWlS2k2HdY9071dhxtUKT7ceW0grofPilPWoEiltnwEEg1HuhNnjmm3ebhukxEBbujvQCzKRSpQWevDwSjr7tTam5U5R3T6Es3r1T07xx4b7yTEtvZ"
});
