document.addEventListener('DOMContentLoaded',()=>{
  const toggle=document.querySelector('.menu-toggle');
  const menu=document.querySelector('.mobile-menu');
  if(toggle&&menu){toggle.addEventListener('click',()=>{const open=menu.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-hidden',String(!open));});}
  const links=[...document.querySelectorAll('.mobile-menu a')]; links.forEach(a=>a.addEventListener('click',()=>{menu?.classList.remove('open');}));
  const sections=[...document.querySelectorAll('main section[id]')]; const nav=[...document.querySelectorAll('.desktop-menu a')];
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){nav.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id));}}),{rootMargin:'-35% 0px -55% 0px',threshold:0}); sections.forEach(s=>io.observe(s));
});
