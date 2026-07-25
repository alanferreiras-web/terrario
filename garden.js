(()=>{
  const root=document.querySelector('.terrario-home');
  if(!root)return;

  const cards=[...document.querySelectorAll('.project-list .project-card:not(.placeholder)')];
  const projects=cards.map(card=>({name:(card.querySelector('.project-name')?.textContent||'').trim()})).filter(project=>project.name).slice(0,10);
  const defaults={'Novela Vertical':1,'Voltinha':2,'Banca':3};
  const species=['flower','foliage','fruit','cactus'];
  const speciesColumn={flower:0,foliage:1,fruit:2,cactus:3};
  const labelColors=['#f7dfa5','#dce4bd','#ead0ef','#f2c9d1','#cbdced'];

  function hash(text){
    let value=2166136261;
    for(let index=0;index<text.length;index++){
      value^=text.charCodeAt(index);
      value=Math.imul(value,16777619);
    }
    return value>>>0;
  }

  function slug(name){
    return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  }

  function storageKey(name){return `terrario-stage-${slug(name)}`}

  function stageOf(name){
    const saved=Number(localStorage.getItem(storageKey(name)));
    return saved>=1&&saved<=3?saved:(defaults[name]||1);
  }

  function skyClass(){
    const hour=new Date().getHours();
    if(hour<6||hour>=20)return 'sky-night';
    if(hour>=17)return 'sky-evening';
    return 'sky-day';
  }

  function render(){
    root.className=`terrario-home ${skyClass()}`;
    root.innerHTML='<div class="garden" aria-label="Jardim de projetos"><div class="garden-plants"></div><div class="garden-soil" aria-hidden="true"></div></div>';
    const list=root.querySelector('.garden-plants');
    list.style.setProperty('--plant-count',Math.max(projects.length,1));

    projects.forEach(project=>{
      const projectHash=hash(project.name);
      const type=species[projectHash%species.length];
      const stage=stageOf(project.name);
      const button=document.createElement('button');
      button.type='button';
      button.className='garden-plant';
      button.dataset.stage=stage;
      button.setAttribute('aria-label',`${project.name}, fase ${stage}. Clique para mudar a fase.`);
      button.style.setProperty('--label-bg',labelColors[(projectHash>>>5)%labelColors.length]);
      button.style.setProperty('--sprite-x',String(speciesColumn[type]));
      button.style.setProperty('--sprite-y',String(stage-1));
      button.innerHTML=`<span class="garden-label">${project.name}</span><span class="garden-stem-dot" aria-hidden="true"></span><span class="garden-sprite" aria-hidden="true"></span>`;
      button.addEventListener('click',()=>{
        const next=Number(button.dataset.stage)%3+1;
        localStorage.setItem(storageKey(project.name),String(next));
        render();
      });
      list.appendChild(button);
    });
  }

  render();
})();