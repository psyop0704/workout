(function(){
  'use strict';
  var currentKey='',selected=0,mode='poses';
  function el(tag,cls,text){var n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n;}
  function button(label,active,fn){var b=el('button','',label);b.type='button';b.setAttribute('aria-pressed',String(active));b.addEventListener('click',fn);return b;}
  function render(){
    var root=document.getElementById('mi');root.replaceChildren();root.style.display='block';
    var items=(window.EXERCISE_MEDIA||{})[currentKey]||[];
    if(!items.length){root.appendChild(el('p','media-error','이 항목의 동작 그림을 불러올 수 없습니다. 아래 자세 설명을 확인하세요.'));return;}
    var item=items[selected];
    var header=el('div','media-header');header.appendChild(el('h3','','동작 · 자극 부위'));
    var modes=el('div','media-modes');
    modes.appendChild(button('두 자세',mode==='poses',function(){mode='poses';render();}));
    modes.appendChild(button('동작 재생',mode==='animation',function(){mode='animation';render();}));
    if(!item.static)header.appendChild(modes);root.appendChild(header);
    if(items.length>1){var variants=el('div','media-variants');variants.setAttribute('aria-label','동작 선택');items.forEach(function(v,i){variants.appendChild(button(v.label,selected===i,function(){selected=i;render();}));});root.appendChild(variants);}
    var stage=el('div',mode==='poses'&&!item.static?'media-poses':'media-animation');
    function picture(src,label){var img=el('img');img.src=src;img.alt=item.label+' — '+label;img.decoding='async';img.addEventListener('error',function(){if(!stage.querySelector('.media-error')){stage.replaceChildren(el('p','media-error','그림을 불러오지 못했습니다. 아래 원본 링크에서 확인할 수 있습니다.'));}});return img;}
    if(item.static){stage.appendChild(picture(item.pose1,'유지 자세'));}
    else if(mode==='poses'){
      [item.pose1,item.pose2].forEach(function(src,i){var fig=el('figure');fig.appendChild(picture(src,'자세 '+(i+1)));fig.appendChild(el('figcaption','','자세 '+(i+1)));stage.appendChild(fig);});
    }else{stage.appendChild(picture(item.local,'동작 애니메이션'));}
    root.appendChild(stage);
    var footer=el('div','media-footer');footer.appendChild(el('p','media-caption',item.label));
    footer.appendChild(el('p','media-note',item.kind==='mobility'?'스트레칭 동작 예시 · 여러 부위를 순서대로 진행하세요.':item.kind==='cardio'?'유산소 동작 예시 · 속도와 강도는 아래 세트 설정을 따르세요.':'붉은색은 원본 그림에서 강조한 근육입니다. 주동근·보조근 구분은 아래 타겟을 확인하세요.'));
    if(item.note)footer.appendChild(el('p','media-note',item.note));
    var a=el('a','media-source','이미지 출처 · Fitness Programer ↗');a.href=item.source;a.target='_blank';a.rel='noopener noreferrer';footer.appendChild(a);root.appendChild(footer);
  }
  window.renderExerciseMedia=function(key){currentKey=key;selected=0;mode='poses';render();};
})();
