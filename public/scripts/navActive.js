

const setActiveNavLink = async () => {
    const nav = await document.querySelector('div.navbar-nav')
    const navlinks = await nav.children;
    const url = await window.location.href;

    for(let i of navlinks) {
        if(i.href == url){
            i.classList.add('active');
        }
    }
}

setActiveNavLink();

