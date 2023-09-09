let recognition;
let mediaRecorder;
let audioChunks = [];

if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById('recognizedText').textContent = `Recognized Text: ${transcript}`;
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
    };

    document.getElementById('startSpeechRecognition').addEventListener('click', () => {
        recognition.start();
    });
} else {
    console.error('Speech recognition is not supported in this browser.');
}

document.getElementById('startRecording').addEventListener('click', () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                document.getElementById('audioPlayback').src = audioUrl;
            };

            mediaRecorder.start();
            document.getElementById('startRecording').disabled = true;
            document.getElementById('stopRecording').disabled = false;
        })
        .catch((error) => {
            console.error('Media device access error:', error);
        });
});

document.getElementById('stopRecording').addEventListener('click', () => {
    if (mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        document.getElementById('startRecording').disabled = false;
        document.getElementById('stopRecording').disabled = true;
    }
});

document.getElementById('saveAudio').addEventListener('click', () => {
    if (audioChunks.length > 0) {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioAnchor = document.createElement('a');
        audioAnchor.href = audioUrl;
        audioAnchor.download = 'recorded_audio.wav';
        audioAnchor.click();
    }
});

document.getElementById('saveText').addEventListener('click', () => {
    const recognizedText = document.getElementById('recognizedText').textContent;
    const textBlob = new Blob([recognizedText], { type: 'text/plain' });
    const textUrl = URL.createObjectURL(textBlob);
    const textAnchor = document.createElement('a');
    textAnchor.href = textUrl;
    textAnchor.download = 'recognized_text.txt';
    textAnchor.click();
});
