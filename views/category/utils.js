// StrToDOM, 반복적인 HTML 구조를 템플레이트 구조에 담아서 서버에서 온 데이터를 담아 String을 Tag로 변환하는 방법.
export function xmlStringToDom(xmlString) {
    const template = document.createElement('template');

    template.innerHTML = xmlString;
    return template.content.firstElementChild
}

// 부모노드 초기화. (innerHTML = '' 과 같은 역할)
export function removeChildren(parentNode) {
    while (parentNode.firstChild) {
        parentNode.removeChild(parentNode.lastChild);
    }
}
