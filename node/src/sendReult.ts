import { Result } from "./types";

export const sendResult = async (result: Result) => {
    try{
        // не хардкодить адрес бы
        const response = await fetch("http://localhost:5173/api", {
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
        sendResult(result)
    }
};
