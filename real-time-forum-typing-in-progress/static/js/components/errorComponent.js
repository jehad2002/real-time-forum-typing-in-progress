export function createErrorPage(statusCode, message, description, container) {
    const errorElement = document.createElement("div");
    errorElement.style.textAlign = "center";
    errorElement.innerHTML = `
        <h1 style="font-size: 800%; color: orangered; margin-bottom: 0px;"> ${statusCode} </h1>
        <h2 style="font-size: 700%; color: orangered; margin-top: 0px; margin-bottom: 0px;"> ${message} </h2>
        <p> ${description} </p>
    `;

    container.appendChild(errorElement);
    document.querySelector('body').appendChild(container)
}