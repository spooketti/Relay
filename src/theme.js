function switchTheme(theme)
{
    let elements = document.querySelectorAll('[data-theme]') //switch the theme between dark light purple etc.
    for(let i=0;i<elements.length;i++)
    {
        elements[i].dataset.theme = theme
    }
}