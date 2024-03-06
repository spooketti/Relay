function switchTheme(theme)
{
    let elements = document.querySelectorAll('[data-theme]')
    for(let i=0;i<elements.length;i++)
    {
        elements[i].dataset.theme = theme
    }
}