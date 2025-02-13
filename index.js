
const apiKey = "pbWK7RWlH1LWtuYZbZ75:01f7cd55499a601c853af7c90c7b938b9d7107518869a1f3e2660782081395ee";
const apiUrl = "https://api.scenex.jina.ai/v1/describe";

const eventsContainer = document.querySelector("#events-container2");
const btn1 = document.querySelector('.btn');
btn1.addEventListener('click', startProcess);

async function startProcess() {
    console.log("startProcess function called");

    const videoUrl = document.getElementById("videoUrlInput").value;
    if (!videoUrl) {
        alert("Please enter a video URL.");
        return;
    }

    document.getElementById("videoPlayer").src = videoUrl;
    document.getElementById("response").textContent = "Processing...";

    const data = JSON.stringify({
        data: [
            {
                video: videoUrl,
                algorithm: "Inception",
                languages: ["en"]
            }
        ]
    });

    const headers = {
        "x-api-key": apiKey,
        "content-type": "application/json"
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: data
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log("Full Response Data:", responseData);

        if (responseData.result && responseData.result.length > 0) {
            const taskId = responseData.result[0].id;
            console.log("Task ID:", taskId);
            document.getElementById("tid").innerText = "TaskId - Copy This : " + taskId;

            let SCENE_ID = taskId;
            console.log(SCENE_ID);

            fetch(`https://api.scenex.jina.ai/v1/scene/${SCENE_ID}`, {
                headers: {
                    'x-api-key': `token ${'pbWK7RWlH1LWtuYZbZ75:01f7cd55499a601c853af7c90c7b938b9d7107518869a1f3e2660782081395ee'}`,
                    'content-type': 'application/json'
                },
                method: 'GET'
            }).then(resp => {
                resp.json().then(data => {
                    console.log(data.result.data.text);
                    document.getElementById("response").innerText = data.result.data.text
                });
            });
        } else {
            console.error("Error: Task ID not found in response. Full response:", responseData);
        }
    } catch (error) {
        console.error("Error making request:", error);
        document.getElementById("response").textContent = "Error making request. Check console for details.";
    }

}

async function checkTaskStatus(taskId) {
    try {
        console.log(`Checking task status for taskId: ${taskId}`);

        const response = await fetch(`https://api.scenex.jina.ai/v1/task/${taskId}`, {
            method: 'GET',
            headers: {
                "x-api-key": apiKey
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const statusData = await response.json();
        const status = statusData.status;

        if (status === 'pending') {
            document.getElementById("response").textContent = "Processing... Please wait.";
            setTimeout(() => checkTaskStatus(taskId), 2000);
        } else {
            document.getElementById("response").textContent = "Process complete. Result: " + JSON.stringify(statusData);
        }
    } catch (error) {
        console.error("Error checking task status:", error);
        document.getElementById("response").textContent = "Error checking task status.";
    }

}
