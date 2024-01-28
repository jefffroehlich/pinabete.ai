const inputEl = document.getElementById('input-el');
const btnEl = document.getElementById('btn-el');

btnEl.addEventListener('click', () => {
  sendData(inputEl.value);
  inputEl.value = '';
});

inputEl.addEventListener('keydown', function (event) {
  // Check if the pressed key is Enter
  if (event.key === 'Enter') {
    sendData(inputEl.value);
    inputEl.value = '';
  }
});

let clientSideMessage = [];

async function sendData(userInput) {
  clientSideMessage.push({ role: 'user', content: userInput });

  const response = await fetch(
    'https://pinabete-ai.onrender.com/sendUserInput',
    {
      method: 'POST',
      body: JSON.stringify({
        id: 1,
        message: clientSideMessage,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }
  );
  if (response.ok) {
    const data = await response.json();
    clientSideMessage.push({ role: 'assistant', content: data });
    console.log(data);
    const promptDiv = document.createElement('div');
    promptDiv.innerText = userInput;
    promptDiv.classList.add('prompt');

    const responseDiv = document.createElement('div');
    responseDiv.innerText = data;
    responseDiv.classList.add('response');

    const responseContainer = document.getElementById('response-container');
    responseContainer.prepend(responseDiv);
    responseContainer.prepend(promptDiv);
  }
}
