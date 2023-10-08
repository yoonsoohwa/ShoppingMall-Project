export function xmlStringToDom(xmlString) {
    const template = document.createElement('template');

    template.innerHTML = xmlString;
    return template.content.firstElementChild
}