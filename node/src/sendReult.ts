import { Result } from "./types";

export const sendResultHttp = async (host: string, result: Result) => {
    try{
        const response = await fetch(host, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ result }), 
          });
          if (!response.ok) {
            console.log('failed to send result');
            throw new Error(`Failed to send result. Status: ${response.status}`);
          }
          console.log("Result sent successfully");
    } catch (error: any ) {
        console.error('Error sending result:', error);
        sendResultHttp(host,result)
    }
};

