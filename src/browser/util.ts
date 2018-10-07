export function createElement(html: string) : Element {
    const template = document.createElement('div');
    template.innerHTML = html.trim();
    return (template as any).firstChild;
}