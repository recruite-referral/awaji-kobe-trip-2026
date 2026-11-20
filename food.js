const foodDays = {
  1: {
    title: '淡路島の、もぐもぐ候補', initial: 'lunch',
    intro: '西海岸でランチ、夜は東浦か夢舞台へ。おなかの気分で、ふたりの「食べたい！」を選ぼう♪',
    footer: '島のおいしい、今日はどれにする？',
    meals: {
      breakfast: {label: '朝ごはん', note: '品川6:00発。朝ごはんは車内で♪ 5:40頃の品川到着と乗車準備を優先して、持参がいちばん安心。', places: [
        {name: 'おにぎり・サンドイッチを持参', type: '時間にゆとり', description: '前日に用意して、出発したら車窓を眺めてもぐもぐ。早朝の売店探しをせずに、ゆっくり食べられるよ。', budget: '500〜1,000円', hours: '6:00出発後、車内で', access: '乗車前に用意。新大阪の乗換8分では買い物をしない想定。'},
        {name: '品川駅で軽食を買う（時間があれば）', type: '営業中なら', description: '開いている駅ナカ売店でおにぎりやサンドイッチを。時間がかかりそうなら、持参した朝ごはんで出発しよう。', budget: '1,000〜2,000円', hours: '早朝営業・売り場は当日確認', access: '6:00発に余裕を持って乗車。買い物を優先して乗り遅れないように。', query: '品川駅 エキュート コンビニ', source: 'https://www.ecute.jp/shinagawa', sourceLabel: '駅ナカの案内'}
      ]},
      lunch: {label: '昼ごはん', note: '絵付けの終了時刻に合わせて12:00〜13:00頃。移動を少なくするならSMILE館内、海辺ランチならクラフトサーカス。', places: [
        {name: '淡路島クラフトキッチン', type: '海辺で分けっこ', description: '島ピザや淡路たまねぎバーガーが気になるね。海を眺めながら、ふたりで相談して分けっこ♪', budget: '2,000〜3,500円', hours: '11:00〜18:00／L.O.17:30（冬季案内）', access: 'HELLO KITTY SMILEから北側。シャトルの運行を確認、合わなければタクシーを手配。', query: 'クラフトサーカス 兵庫県淡路市野島平林2-2', source: 'https://awajicraftcircus.com/kitchen/'},
        {name: '竜宮レストラン 玉手箱', type: 'キティ時間をもう少し', description: '御膳やひとり鍋を楽しめるSMILE館内のお店。絵付けのあとに、そのままお昼にできるのがうれしいね。', budget: '2,500〜4,000円', hours: '11:00〜19:00／L.O.18:30', access: 'HELLO KITTY SMILE館内。施設入場料は別途。席・注文条件を公式で確認。', query: '竜宮レストラン 玉手箱 HELLO KITTY SMILE', source: 'https://awaji-resort.com/hellokittysmile/restaurant/'}
      ]},
      dinner: {label: '夜ごはん', note: '気軽にお寿司なら東浦、夢舞台の散策後なら現地で夕食も。夢舞台からホテルへの帰りの交通は先に確保してね。', places: [
        {name: '金太郎 東浦店', type: 'ホテル近くの本命', description: '淡路の地魚を楽しむ回転寿司。ふたりの好きなネタを少しずつ選べて、気取らない夜ごはんにぴったり。', budget: '2,000〜4,000円', hours: '17:00〜21:00／L.O.20:45・水曜定休', access: 'ホテル公式の周辺案内で約0.5km。徒歩経路は地図で確認。席予約不可なので待ち時間に余裕を。', query: '金太郎 東浦店 淡路市浦726-1', source: 'https://atcompany.jp/higashiurakintarou/', sourceLabel: '店舗公式の営業案内'},
        {name: '海鮮料理 きとら 夢舞台店', type: '散策のあとに', description: '夢舞台で景色を楽しんだら、海鮮や和食で夜ごはん。ホテルへ戻る前に食事をすませられる候補だよ。', budget: '2,000〜4,000円', hours: '17:00〜21:00／L.O.20:00・不定休', access: '淡路夢舞台レストラン＆ショップ。東浦のホテルへ戻るタクシー等を事前に確認。', query: 'きとら 淡路夢舞台', source: 'https://www.yumebutai.co.jp/restaurant/'},
        {name: 'コッコラーレ ブッフェ', type: 'いろいろ食べたい夜', description: 'グランドニッコー淡路で、好きなものを少しずつ。ふたりの「これも食べたい」がそろうホテルのブッフェ。', budget: '通常土日祝 大人6,500円／飲み物等は別途', hours: '17:30〜21:00／17:30・19:30の2部、90分制', access: '夢舞台隣接のホテル。空席・料金を公式で確認、予約推奨。帰りのタクシー等も手配。', query: 'コッコラーレ グランドニッコー淡路', source: 'https://awaji.grandnikko.com/restaurant/coccolare/buffet.php'}
      ]}
    }
  },
  2: {
    title: '東浦と神戸の、おいしい時間', initial: 'breakfast',
    intro: '朝は東浦でほっとひと息。お昼は神戸で、帰りはお弁当もいいね。朝・昼・夜のタブから選んでね♪',
    footer: 'おいしい思い出も、いっしょに東京へ。',
    meals: {
      breakfast: {label: '朝ごはん', note: '東浦BT9:20発に合わせ、8:00入店・8:45頃までの食事終了を目安に。荷物を受け取り、9:05頃にはバス停へ。ホテル朝食付きとは限らないので予約内容も確認。', places: [
        {name: 'アワジ珈琲', type: '朝8時から', description: 'レトロな喫茶のモーニングとコーヒーで、おはよう。軽めに食べて、神戸のランチにおなかの余白を残そう♪', budget: '500〜1,200円', hours: '8:00〜18:00／モーニング8:00〜11:00・不定休', access: '淡路市浦55。東浦のホテル周辺。待ち時間が長ければ、バスに合わせて持ち帰り等へ切り替え。', query: 'アワジ珈琲 淡路市浦55', source: 'https://resort.goodey.co.jp/guidance-post37/', sourceLabel: '運営元の案内'},
        {name: 'Plants Cafe コハルビヨリ', type: 'パンとコーヒー', description: 'お花のような自家焼成パンとコーヒーが朝の候補。お花とカフェの空間で、のんびりしすぎない程度にひと休み。', budget: '1,000〜2,000円', hours: '8:00から朝営業／メニュー・営業日は公式確認', access: '淡路市久留麻3-1。ホテルから徒歩圏。8:00に向かい、東浦BTへの戻り時間を確保。', query: 'Plants Cafe コハルビヨリ 淡路市久留麻3-1', source: 'https://koharubiyori2017.com/apps/note/378/'}
      ]},
      lunch: {label: '昼ごはん', note: '11:00頃の南京町で、食べ歩きか座ってランチを選ぼう。食後は旧居留地、メリケンパークへ。', places: [
        {name: '老祥記', type: '豚まんをもぐもぐ', description: '南京町の定番、小さめの豚まん。ほかのお店も少しずつ楽しむ食べ歩きコースに。行列が長ければ無理せず切り替えよう。', budget: '食べ歩き全体で1,000〜2,000円', hours: '10:00〜18:30／売り切れ次第終了・不定休', access: '南京町広場そば、元町通1-3-7。土日祝は公式案内でも行列に注意。', query: '老祥記 神戸市中央区元町通1-3-7', source: 'https://roushouki.com/shop/'},
        {name: '民生 廣東料理店 南京町店', type: '座ってゆっくり', description: '食べ歩きより座って食べたい気分なら、本格広東料理へ。名物のいかの天ぷらや、ご飯・麺をふたりで相談して。', budget: '2,000〜4,000円', hours: '11:30〜14:30／L.O.14:00', access: '南京町内、元町通1-3-4。11:30開店に合わせると、その後の街歩きにもつなげやすい。', query: '民生 廣東料理店 神戸市中央区元町通1-3-4', source: 'https://www.minsei.net/company'}
      ]},
      dinner: {label: '夜ごはん', note: '新神戸16:24発→品川18:59着。帰りの夕食は車内で少し早めに、または品川で買っておうちで。神戸で夜のお店に入る時間は取っていないよ。', places: [
        {name: '淡路屋の駅弁を、帰りの車内で', type: '旅の最後のもぐもぐ', description: 'ひっぱりだこ飯など、気になる駅弁を新神戸で。食べたいタイミングでふたを開けて、旅の話をもう少し♪', budget: '1,300〜2,500円', hours: '新神戸2階改札内売店。15:45〜16:05頃の購入を目安に', access: 'のぞみ172号の乗車前に購入。品切れ・消費期限を確認し、乗車準備を優先。', query: '淡路屋 新神戸駅', mapQuery: '34.706615,135.1958034', source: 'https://www.awajiya.co.jp/bento/'},
        {name: 'エキュート品川でテイクアウト', type: 'おうちでほっと', description: '車内では軽めにして、品川でお弁当やお惣菜を買って帰るのも。選ぶ時間は短めにして、赤羽橋へ向かおう。', budget: '1,000〜2,500円', hours: '18:59品川着後。日曜デリは通常20:30頃まで、一部店舗で異なる', access: 'JR品川駅改札内。乗換経路に合わせて利用し、19:30〜19:50頃の帰宅目安を調整。', query: 'エキュート品川', source: 'https://www.ecute.jp/shinagawa'}
      ]}
    }
  }
};
const foodEscape = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function refreshFoodMap(pageId) {
  if (!pageId.startsWith('food-day')) return;
  const frame = document.querySelector('#' + pageId + ' iframe');
  if (frame.dataset.mapSrc && frame.getAttribute('src') !== frame.dataset.mapSrc) frame.src = frame.dataset.mapSrc;
}
for (const [day, data] of Object.entries(foodDays)) {
  const page = document.createElement('article');
  page.id = 'food-day' + day;
  page.className = 'page food-page';
  page.setAttribute('aria-label', 'DAY ' + day + ' グルメマップ');
  page.innerHTML = `<header class="page-heading"><span class="character bow" aria-hidden="true"></span><h2>DAY ${day} グルメ</h2><span class="character beret" aria-hidden="true"></span></header><h3 class="map-title">${data.title}</h3><p class="food-intro">${data.intro}</p><div class="food-meals" role="tablist" aria-label="食事の時間帯">${Object.entries(data.meals).map(([key,meal])=>`<button type="button" role="tab" id="food-tab-${day}-${key}" data-meal="${key}" aria-controls="food-panel-${day}" aria-selected="false">${meal.label}</button>`).join('')}</div><p class="food-meal-note"></p><div class="food-map"><iframe title="DAY ${day} 食事候補のGoogleマップ" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div><div class="food-map-caption"><strong class="food-map-name"></strong><a class="food-current-map" target="_blank" rel="noopener noreferrer">Googleマップを開く</a></div><button type="button" class="food-map-toggle" aria-pressed="false">地図を操作する</button><div class="food-candidates" id="food-panel-${day}" role="tabpanel"></div><p class="food-source-note">すべて未予約の候補です。予算は1名分の目安で、飲み物・移動費は別。通常営業の案内を2026/11/21に確認しています。当日の休業・空席・価格変更は、各店の案内で確認してね。</p><button type="button" class="return-day" data-return-day="${day}">DAY ${day} の日程に戻る</button><footer class="page-footer"><span class="character kitty" aria-hidden="true"></span><p>${data.footer}</p><span class="character purin" aria-hidden="true"></span></footer>`;
  document.getElementById('map-day' + day).insertAdjacentElement('afterend', page);
  const jump = document.createElement('button');
  jump.type = 'button'; jump.className = 'day-map-jump food-map-jump';
  jump.dataset.goFood = page.id; jump.textContent = '朝・昼・夜のグルメマップ♪';
  document.querySelector('#day' + day + ' .day-map-jump').insertAdjacentElement('afterend', jump);
  const mapBox = page.querySelector('.food-map');
  const frame = mapBox.querySelector('iframe');
  const toggle = page.querySelector('.food-map-toggle');
  toggle.addEventListener('click', () => {
    const enabled = toggle.getAttribute('aria-pressed') !== 'true';
    toggle.setAttribute('aria-pressed', String(enabled));
    toggle.textContent = enabled ? 'ページのスクロールに戻る' : '地図を操作する';
    mapBox.classList.toggle('is-interactive', enabled);
  });
  function showPlace(place, index) {
    const query = encodeURIComponent(place.query);
    const mapQuery = encodeURIComponent(place.mapQuery || place.query);
    frame.dataset.mapSrc = 'https://maps.google.com/maps?q=' + mapQuery + '&z=15&output=embed';
    page.querySelector('.food-map-name').textContent = place.name;
    page.querySelector('.food-current-map').href = 'https://www.google.com/maps/search/?api=1&query=' + query;
    page.querySelectorAll('.food-card').forEach((card, i) => card.classList.toggle('is-selected', i === index));
    mapBox.classList.remove('is-interactive');
    toggle.setAttribute('aria-pressed', 'false'); toggle.textContent = '地図を操作する';
    if (Math.abs(page.getBoundingClientRect().left - page.parentElement.getBoundingClientRect().left) < 2) refreshFoodMap(page.id);
  }
  function renderMeal(key) {
    const meal = data.meals[key];
    page.querySelectorAll('[data-meal]').forEach(button => button.setAttribute('aria-selected', String(button.dataset.meal === key)));
    page.querySelector('.food-meal-note').textContent = meal.note;
    const panel = page.querySelector('.food-candidates');
    panel.setAttribute('aria-labelledby', 'food-tab-' + day + '-' + key);
    panel.innerHTML = meal.places.map((place, i) => `<section class="food-card"><span class="food-card-tag">${foodEscape(place.type)}</span><h4>${foodEscape(place.name)}</h4><p>${foodEscape(place.description)}</p><dl><div><dt>予算</dt><dd>${foodEscape(place.budget)}</dd></div><div><dt>時間</dt><dd>${foodEscape(place.hours)}</dd></div><div><dt>行き方</dt><dd>${foodEscape(place.access)}</dd></div></dl><div class="food-card-actions">${place.query?`<button type="button" data-food-place="${i}">地図に表示</button>`:''}${place.source?`<a href="${place.source}" target="_blank" rel="noopener noreferrer">${foodEscape(place.sourceLabel || '公式の案内')}</a>`:''}</div></section>`).join('');
    panel.querySelectorAll('[data-food-place]').forEach(button => button.addEventListener('click', () => {
      const index = Number(button.dataset.foodPlace);
      showPlace(meal.places[index], index);
      page.scrollTo({top: 0, behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'instant' : 'smooth'});
    }));
    const first = meal.places.findIndex(place => place.query);
    showPlace(meal.places[first], first);
  }
  page.querySelectorAll('[data-meal]').forEach(button => button.addEventListener('click', () => renderMeal(button.dataset.meal)));
  renderMeal(data.initial);
}
for (const day of [2,1]) {
  const jump = document.createElement('button');
  jump.type = 'button'; jump.className = 'spot-link'; jump.dataset.goFood = 'food-day' + day;
  jump.innerHTML = `<span>DAY ${day} グルメマップ<small>朝・昼・夜の、おいしい候補</small></span><span class="link-tag">ごはんを探す</span>`;
  document.getElementById('spot-list').prepend(jump);
}
