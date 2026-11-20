const tripMapData={
  1:{title:'淡路島 おでかけマップ',caption:'海のそばの、かわいいとおいしいを探そう♪',intro:'赤いピンが、今日のよりみち。気になる場所をタップしてみてね。淡路ICからSMILEへ向かったら、島内はバスやタクシーでおでかけしよう。',stops:[
    {key:'smile',name:'HELLO KITTY SMILE',time:'10:30頃',lat:34.56717,lng:134.95252},
    {key:'craft',name:'クラフトサーカス',time:'12:30頃・候補',lat:34.5865448,lng:134.9665865},
    {key:'hotel',name:'ホテルでひとやすみ',time:'15:00',lat:34.5376595,lng:134.9938631},
    {key:'yumebutai',name:'淡路夢舞台',time:'16:00頃',lat:34.560889,lng:135.006889}
  ],route:[0,1,2,3]},
  2:{title:'神戸 てくてくマップ',caption:'もぐもぐ、てくてく。港まで、ふたりのペースで。',intro:'三宮で荷物を預けたら、身軽に街歩き♪ 南京町、旧居留地、メリケンパークを楽しんだら、三宮で荷物を受け取って新神戸へ。帰りの新幹線も、準備できたよ。',stops:[
    {key:null,name:'三宮駅周辺',time:'到着・荷物を預ける／帰りに回収',lat:34.6945454,lng:135.1952558,query:'神戸 三宮駅'},
    {key:'nankin',name:'南京町',time:'11:00頃',lat:34.6879782,lng:135.1877123},
    {key:'kyoryuchi',name:'旧居留地',time:'12:15頃・十五番館付近を表示',lat:34.6872562,lng:135.1921914},
    {key:'meriken',name:'メリケンパーク',time:'13:15頃',lat:34.68214,lng:135.1887},
    {key:null,name:'新神戸駅',time:'16:24 のぞみ172号に乗車',lat:34.706615,lng:135.1958034,query:'新神戸駅'}
  ],route:[0,1,2,3,0,4]}
};
const tripMapInstances=new Map();
for(const [day,data] of Object.entries(tripMapData)){
 const p=document.createElement('article');p.className='page map-page';p.id='map-day'+day;p.dataset.day=day;p.setAttribute('aria-label',data.title);
 const ticket=day==='2'?'<div class="return-reservation"><span class="reservation-badge">帰りの新幹線 予約済み</span><strong>11/22 新神戸 16:24 発</strong><p>のぞみ172号　品川 18:59 着</p><p>普通車・N700系16両<br>4号車12番 A席・B席</p><small>赤羽橋には19:30〜19:50頃の到着が目安だよ。</small></div>':'';
 p.innerHTML=`<header class="page-heading"><span class="character bow" aria-hidden="true"></span><h2>DAY ${day} マップ</h2><span class="character beret" aria-hidden="true"></span></header><h3 class="map-title">${data.title}</h3><p class="map-caption">${data.caption}</p><div class="trip-map" id="trip-map-${day}" aria-label="${data.title}。拡大縮小とピンの選択ができます。"><p class="map-loading">おでかけマップをひらいているよ…</p></div><div class="map-toolbar"><button type="button" data-fit-map="${day}">みんなのピンを見る</button><button type="button" class="map-drag-toggle" data-toggle-map="${day}" aria-pressed="false">地図を動かす</button><span>ピンをタップしてみてね♪</span></div><p class="map-help">線は立ち寄る順番の目安です。位置は施設・駅周辺を示しています。入口や乗り場は各Googleマップで確認してください。</p><p class="map-intro">${data.intro}</p><div class="map-stop-list">${data.stops.map((s,i)=>`<div class="map-stop"><span class="map-stop-no">${i+1}</span><div><strong>${s.name}</strong><small>${s.time}</small><div class="map-stop-actions">${s.key?`<button type="button" data-spot="${s.key}">紹介を読む</button>`:''}<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.key?guideContent[s.key].map:s.query)}" target="_blank" rel="noopener noreferrer">Googleマップ</a></div></div></div>`).join('')}</div>${ticket}<button type="button" class="return-day" data-return-day="${day}">DAY ${day} の日程に戻る</button><footer class="page-footer"><span class="character kitty" aria-hidden="true"></span><p>ふたりのわくわく、つながる地図♪</p><span class="character purin" aria-hidden="true"></span></footer>`;
 const overview=document.getElementById('day'+day);overview.insertAdjacentElement('afterend',p);
 const jump=document.createElement('button');jump.type='button';jump.className='day-map-jump';jump.dataset.goMap=p.id;jump.textContent='おでかけマップをひらく♪';overview.querySelector('.day-date').insertAdjacentElement('afterend',jump);
}
function refreshTripMap(pageId){
 if(!pageId.startsWith('map-day'))return;
 const day=pageId.slice(-1),data=tripMapData[day];
 if(!window.L)return;
 if(tripMapInstances.has(day)){tripMapInstances.get(day).map.invalidateSize({pan:false});return;}
 const host=document.getElementById('trip-map-'+day);host.querySelector('.map-loading')?.remove();
 const mobileMap=matchMedia('(max-width:767px), (max-height:600px) and (pointer:coarse)').matches;
 const map=L.map(host,{scrollWheelZoom:false,tap:false,dragging:!mobileMap});
 const toggle=document.querySelector(`[data-toggle-map="${day}"]`);
 toggle.addEventListener('click',()=>{const enabled=toggle.getAttribute('aria-pressed')!=='true';toggle.setAttribute('aria-pressed',String(enabled));toggle.textContent=enabled?'ページをスクロールする':'地図を動かす';host.classList.toggle('map-interactive',enabled);if(enabled)map.dragging.enable();else map.dragging.disable();});const bounds=L.latLngBounds(data.stops.map(s=>[s.lat,s.lng]));map.fitBounds(bounds,{padding:[35,35]});tripMapInstances.set(day,{map,bounds});
 const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'}).addTo(map);
 let loaded=0;tiles.on('tileload',()=>{loaded++;host.dataset.loadedTiles=String(loaded)});
 L.polyline(data.route.map(i=>[data.stops[i].lat,data.stops[i].lng]),{color:'#de0030',weight:3,dashArray:'5 8',opacity:.7,interactive:false}).addTo(map);
 data.stops.forEach((s,i)=>{
  const icon=L.divIcon({className:'trip-pin',html:`<span>${i+1}</span>`,iconSize:[34,42],iconAnchor:[17,38],popupAnchor:[0,-34]});
  const popup=document.createElement('div');popup.className='trip-map-popup';const title=document.createElement('strong');title.textContent=s.name;const time=document.createElement('p');time.textContent=s.time;popup.append(title,time);
  if(s.key){const b=document.createElement('button');b.type='button';b.textContent='紹介を読む♪';b.addEventListener('click',()=>{map.closePopup();openSpot(s.key)});popup.append(b);}
  const a=document.createElement('a');a.textContent='Googleマップ';a.href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(s.key?guideContent[s.key].map:s.query);a.target='_blank';a.rel='noopener noreferrer';popup.append(a);
  const marker=L.marker([s.lat,s.lng],{icon,title:s.name,alt:s.name,keyboard:true}).addTo(map).bindPopup(popup,{maxWidth:Math.min(240,host.clientWidth-45),autoPan:true,autoPanPaddingTopLeft:[15,100],autoPanPaddingBottomRight:[15,15]});marker.getElement()?.setAttribute('aria-label',s.name);
 });
 map.fitBounds(bounds,{padding:[35,35]});tripMapInstances.set(day,{map,bounds});document.querySelector(`[data-fit-map="${day}"]`).addEventListener('click',()=>map.fitBounds(bounds,{padding:[35,35]}));
 L.DomEvent.disableClickPropagation(host);L.DomEvent.disableScrollPropagation(host);host.addEventListener('touchmove',e=>e.stopPropagation(),{passive:true});
}
