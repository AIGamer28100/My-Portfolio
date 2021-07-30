document.addEventListener('DOMContentLoaded', function load () {
  const container = document.querySelector('#container');
  const signUp = document.querySelector('#signUp');
  const signIn = document.querySelector('#signIn');

  signUp.addEventListener('click', ()=>{
    container.classList.add('side-right-active');
  });

  signIn.addEventListener('click', ()=>{
    container.classList.remove('side-right-active');
  });
});
