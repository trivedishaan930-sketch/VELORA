/* VELORA — browser-first product foundation. No backend or live AI is implied. */
(() => {
  'use strict';
  const STORAGE = {
    saved: 'velora.saved.v1',
    checks: 'velora.checklist.v1'
  };
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const safeRead = (key, fallback) => {
    try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; }
    catch { return fallback; }
  };
  const safeWrite = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch { showToast('Browser storage is unavailable. Your change may not persist.'); return false; }
  };
  let saved = safeRead(STORAGE.saved, []);
  if (!Array.isArray(saved)) saved = [];
  let toastTimer;
  let currentModalSave = null;

  function showToast(message) {
    const el = $('#toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
  }
  function updateSavedCount() { $('#savedCount').textContent = String(saved.length); }
  function persistSaved() { safeWrite(STORAGE.saved, saved); updateSavedCount(); renderSaved(); }
  function isSaved(name) { return saved.some(item => item.name === name); }
  function toggleSaved(name, type = 'idea') {
    if (isSaved(name)) {
      saved = saved.filter(item => item.name !== name);
      showToast('Removed from your saved moments.');
    } else {
      saved.push({ name, type, addedAt: new Date().toISOString() });
      showToast('Saved to your personal edit.');
    }
    persistSaved();
    syncSaveButtons();
  }
  function syncSaveButtons() {
    $$('[data-save]').forEach(button => {
      const active = isSaved(button.dataset.save);
      button.classList.toggle('is-saved', active);
      button.setAttribute('aria-pressed', String(active));
      button.textContent = active ? '♥' : '♡';
    });
    const modalSave = $('#modalSave');
    if (modalSave && currentModalSave) {
      modalSave.innerHTML = isSaved(currentModalSave.name) ? 'Saved <span>♥</span>' : 'Save this idea <span>♡</span>';
    }
  }
  function renderSaved() {
    const root = $('#savedItems');
    if (!root) return;
    if (!saved.length) {
      root.innerHTML = '<div class="empty-saved">Your personal edit is waiting. Save a destination or an idea as you explore.</div>';
      return;
    }
    root.replaceChildren();
    saved.forEach(item => {
      const row = document.createElement('div'); row.className = 'saved-item';
      const info = document.createElement('div');
      const title = document.createElement('b'); title.textContent = item.name;
      const meta = document.createElement('small'); meta.textContent = `${item.type || 'idea'} · saved on this device`;
      info.append(title, meta);
      const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = 'Remove';
      remove.addEventListener('click', () => toggleSaved(item.name, item.type));
      row.append(info, remove); root.append(row);
    });
  }

  // Navigation: accessible mobile menu and same-page anchors.
  const menuToggle = $('#menuToggle');
  const mobileNav = $('#mobileNav');
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    mobileNav.hidden = isOpen;
    menuToggle.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
  });
  $$('#mobileNav a').forEach(link => link.addEventListener('click', () => {
    mobileNav.hidden = true; menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', 'Open menu');
  }));
  $('#floatConcierge').addEventListener('click', () => $('#concierge').scrollIntoView({ behavior: 'smooth' }));

  // Saved items drawer.
  const savedDialog = $('#savedDialog');
  $('#savedOpen').addEventListener('click', () => { renderSaved(); savedDialog.showModal(); });
  $('#savedClose').addEventListener('click', () => savedDialog.close());
  savedDialog.addEventListener('click', event => { if (event.target === savedDialog) savedDialog.close(); });
  $('#exportSaved').addEventListener('click', () => {
    if (!saved.length) { showToast('Save at least one place or idea first.'); return; }
    const content = ['VELORA — MY SAVED MOMENTS', '', ...saved.map((item, i) => `${i + 1}. ${item.name} (${item.type})`)].join('\n');
    downloadText('velora-saved-moments.txt', content);
  });

  // Destination filters and local search.
  let activeFilter = 'all';
  function filterDestinations() {
    const query = $('#destinationSearch').value.trim().toLowerCase();
    $$('.destination-card').forEach(card => {
      const filterMatch = activeFilter === 'all' || card.dataset.kind === activeFilter;
      const searchMatch = !query || (card.dataset.search + ' ' + card.querySelector('h3').textContent).toLowerCase().includes(query);
      card.hidden = !(filterMatch && searchMatch);
    });
  }
  $$('.filter-pill').forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    $$('.filter-pill').forEach(pill => pill.classList.toggle('active', pill === button));
    filterDestinations();
  }));
  $('#destinationSearch').addEventListener('input', filterDestinations);
  $$('.destination-save').forEach(button => button.addEventListener('click', () => toggleSaved(button.dataset.save, button.dataset.type)));

  // Reusable editorial / destination modal.
  const modal = $('#contentModal');
  const storyContent = {
    'blue-hour': {
      kicker: 'VELORA ORIGINAL · FICTION', title: 'Postcards from the blue hour', save: 'Postcards from the blue hour',
      body: `<p>The harbour was quieter than the town behind it. Mara had come down with a notebook and no particular plan; Elias was waiting for a ferry that would not arrive until morning.</p><p>They began with the weather, moved on to the best bakery on the waterfront, and somehow found themselves talking about the places they had left and the places they hoped to see. Nothing hurried them. The sky turned from apricot to indigo while the boats rocked gently against their ropes.</p><p>When they parted, neither promised anything dramatic. They simply exchanged the names of two places worth visiting. Sometimes a good evening is not a beginning or an ending. It is a lovely moment, allowed to be enough.</p><p><em>Original, non-explicit fiction created for the VELORA concept.</em></p>`
    },
    'gestures': {
      kicker: 'CONNECTION · THE EVERYDAY EDIT', title: 'Small gestures, lasting meaning', save: 'Small gestures, lasting meaning',
      body: `<p>Thoughtfulness rarely needs a grand stage. Remembering how someone takes their coffee, leaving room in a busy day for a proper conversation, or asking what would make a difficult week lighter can mean more than a perfectly staged surprise.</p><p>Try one small ritual: a phone-free walk, a shared playlist, a note in a travel bag, or a check-in before making plans on someone else's behalf. The point is not performance. It is attention.</p><p>Good connection grows through honest communication, mutual comfort and respect for each person's boundaries.</p>`
    },
    'no-itinerary': {
      kicker: 'DATE NIGHT · THE CITY EDIT', title: 'A night with no itinerary', save: 'A night with no itinerary',
      body: `<p>Choose one neighbourhood and one meeting point. Agree on a comfortable budget, then take turns choosing the next stop: a bookshop, a small gallery, a dessert counter, a park with a view.</p><p>Keep the evening flexible, but keep practical details clear. Check closing times, plan a safe way home, and make sure everyone feels comfortable changing the plan.</p><p>A little curiosity can be its own itinerary.</p>`
    }
  };
  const destinationContent = {
    maldives: { title: 'The Maldives', kicker: 'INDIAN OCEAN · ISLAND INSPIRATION', save: 'The Maldives', body: '<p>Think quiet beach time, warm water and slower days. Before planning, compare island transfer options, resort locations, local customs and seasonal conditions. The experience and cost can vary considerably by island and property.</p><p><strong>Planning note:</strong> This is inspiration only. Confirm current entry requirements, weather, transfers, room rates and availability through official sources and the accommodation provider.</p>' },
    amalfi: { title: 'Amalfi Coast', kicker: 'ITALY · MEDITERRANEAN INSPIRATION', save: 'Amalfi Coast', body: '<p>Picture village lanes, sea views and unhurried meals. Build in time for transfers and walking; coastal roads and stairs can make a short distance take longer than expected.</p><p><strong>Planning note:</strong> Check current transport schedules, local access rules, seasonal services and accommodation availability before you commit.</p>' },
    kyoto: { title: 'Kyoto', kicker: 'JAPAN · CULTURE & CITY INSPIRATION', save: 'Kyoto', body: '<p>Garden paths, traditional crafts and neighbourhood food can make for a gentle city escape. Consider an early start for popular cultural sites and plan respectfully around local residents and sacred spaces.</p><p><strong>Planning note:</strong> Verify opening times, visitor guidance, seasonal conditions, local transport and current entry requirements before travel.</p>' }
  };
  function openModal(data) {
    $('#modalKicker').textContent = data.kicker || 'VELORA JOURNAL';
    $('#modalTitle').textContent = data.title;
    $('#modalBody').innerHTML = data.body;
    currentModalSave = data.save ? { name: data.save, type: data.type || 'idea' } : null;
    $('#modalSave').hidden = !currentModalSave;
    $('#modalDone').textContent = 'Close ×';
    syncSaveButtons();
    modal.showModal();
  }
  $$('.story-open').forEach(button => button.addEventListener('click', () => openModal(storyContent[button.dataset.story])));
  $$('.destination-more').forEach(button => button.addEventListener('click', () => openModal({ ...destinationContent[button.dataset.destination], type: 'destination' })));
  $('#modalClose').addEventListener('click', () => modal.close());
  $('#modalDone').addEventListener('click', () => modal.close());
  $('#modalSave').addEventListener('click', () => { if (currentModalSave) toggleSaved(currentModalSave.name, currentModalSave.type); syncSaveButtons(); });
  modal.addEventListener('click', event => { if (event.target === modal) modal.close(); });
  $$('[data-open-legal]').forEach(button => button.addEventListener('click', () => {
    const kind = button.dataset.openLegal;
    const legal = {
      privacy: { kicker: 'PRIVACY NOTES · STARTER BUILD', title: 'Your data, kept simple', body: '<p>This VELORA starter website does not create user accounts or send profile data to a VELORA server. Saved places and checklist selections are stored in your browser using local storage. They may be lost if you clear site data or change devices.</p><p>The concierge demo processes your text locally in the browser and does not call an AI provider. No analytics, advertising trackers or payment systems are configured in this starter build.</p><p>Before public launch, replace this starter note with a reviewed privacy policy that accurately reflects the final hosting, analytics, account, AI and commerce integrations.</p>' },
      terms: { kicker: 'TERMS · STARTER BUILD', title: 'Use VELORA thoughtfully', body: '<p>VELORA is provided as an informational and planning prototype. Content is general inspiration, not a guarantee of travel conditions, supplier quality, safety, medical suitability, availability or price.</p><p>Check official government travel guidance, entry requirements, providers and qualified professionals where relevant. You are responsible for confirming bookings and decisions with the appropriate provider.</p><p>Do not use this prototype to upload sensitive personal information. A production service needs final legal terms, support operations and security review.</p>' },
      safety: { kicker: 'SAFETY PRINCIPLES', title: 'Respect is the starting point', body: '<p>VELORA promotes adult, non-explicit experiences rooted in consent, mutual respect and personal safety. It is not a pornography platform, escort marketplace, sexual-services platform or real-person matchmaking service.</p><p>Do not pressure anyone, share another person’s image without permission, or ignore a stated boundary. Use official emergency services and qualified professionals when needed.</p><p>This prototype has no community posting, direct messaging between users, identity verification or content moderation workflow.</p>' }
    };
    openModal({ ...legal[kind], save: null });
  }));

  // Planner: produces a locally generated sample outline, never a booking or quote.
  const plannerForm = $('#plannerForm');
  const dateInput = $('#planDate');
  const localToday = new Date();
  dateInput.min = `${localToday.getFullYear()}-${String(localToday.getMonth() + 1).padStart(2, '0')}-${String(localToday.getDate()).padStart(2, '0')}`;
  const itineraryTemplates = {
    'Beach & coast': [
      ['Arrive gently', 'Settle in, learn the local area and leave the first evening open.'],
      ['A day by the water', 'Choose a beach, coastal walk or water activity suited to local conditions.'],
      ['Discover nearby', 'Explore a village, market or local food experience.'],
      ['A slower afternoon', 'Keep time for rest, a scenic stop and an unhurried meal.'],
      ['A final favourite', 'Return to the place you enjoyed most and prepare for departure.']
    ],
    'Culture & city': [
      ['Get your bearings', 'Walk a central neighbourhood and note useful transport connections.'],
      ['Culture day', 'Choose a museum, heritage area or guided local experience.'],
      ['Taste the city', 'Explore a market or food district and leave room to wander.'],
      ['A different perspective', 'Visit a garden, viewpoint or quieter local quarter.'],
      ['A favourite revisit', 'Return to a place you loved and make a relaxed departure plan.']
    ],
    'Nature & slow travel': [
      ['Arrive and unwind', 'Settle in, check local conditions and plan an easy first walk.'],
      ['Into the landscape', 'Choose a permitted trail or nature experience appropriate to your ability.'],
      ['A local connection', 'Meet a local guide or explore nearby culture and food.'],
      ['Room to breathe', 'Keep the day flexible for rest, reading and scenic time.'],
      ['Leave lightly', 'Pack, check transport and follow local conservation guidance.']
    ],
    'Luxury & relaxation': [
      ['Settle into your stay', 'Check in, familiarise yourself with facilities and enjoy a slow evening.'],
      ['A restorative day', 'Balance a wellness activity with plenty of unplanned time.'],
      ['A special experience', 'Consider a private guided visit or a memorable dining occasion.'],
      ['Enjoy the details', 'Choose a favourite property experience and allow a relaxed afternoon.'],
      ['A gentle finish', 'Confirm transfers and enjoy one last unhurried moment.']
    ],
    'Adventure & discovery': [
      ['Prepare and arrive', 'Check equipment, local guidance and weather before setting out.'],
      ['First adventure', 'Choose a reputable operator or route matched to your experience.'],
      ['Explore responsibly', 'Discover local culture and respect protected areas and communities.'],
      ['Choose your own pace', 'Mix an active experience with rest and recovery time.'],
      ['Wrap up safely', 'Check onward travel and leave no trace.']
    ],
    'A little of everything': [
      ['A warm welcome', 'Arrive, orient yourself and find a relaxed local spot.'],
      ['See something special', 'Choose one landmark, landscape or cultural experience.'],
      ['Make it personal', 'Add a food, craft, wellness or outdoor activity you enjoy.'],
      ['Leave space', 'Keep part of the day free for a spontaneous discovery.'],
      ['Take the memory home', 'Revisit a favourite and prepare for a smooth departure.']
    ]
  };
  function createItinerary(event) {
    event.preventDefault();
    const destination = $('#planDestination').value.trim();
    if (!destination) { $('#planDestination').focus(); return; }
    const duration = Math.max(1, Math.min(14, Number($('#planDuration').value) || 5));
    const traveller = $('#planTravellers').value;
    const style = $('#planStyle').value;
    const date = $('#planDate').value;
    const budget = $('#planBudget').value;
    const stay = $('#planStay').value;
    const template = itineraryTemplates[style] || itineraryTemplates['A little of everything'];
    const dayPlans = Array.from({ length: duration }, (_, index) => {
      const item = template[index % template.length];
      return `<li><strong>Day ${index + 1} · ${item[0]}</strong><br>${item[1]}</li>`;
    }).join('');
    const travellerLabel = { solo: 'Solo journey', couple: 'Couple getaway', friends: 'Friends / small group', family: 'Family trip' }[traveller];
    const result = $('#plannerResult');
    result.hidden = false;
    result.innerHTML = `<h3>Your ${duration}-day ${travellerLabel.toLowerCase()}</h3><p><strong>${escapeHtml(destination)}</strong> · ${escapeHtml(style)} · ${escapeHtml(stay)}<br>Departure: ${date ? escapeHtml(date) : 'To be decided'} · Budget guide: ${escapeHtml(budget)}</p><ol>${dayPlans}</ol><p><strong>Before booking:</strong> confirm current weather, entry requirements, travel advisories, transport, provider details and full costs. This outline is an illustrative template, not a live itinerary or reservation.</p><div class="result-actions"><button type="button" id="saveItinerary">Save this plan</button><button type="button" id="printItinerary">Print / save as PDF</button><button type="button" id="sendToConcierge">Discuss with concierge</button></div>`;
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    $('#saveItinerary').addEventListener('click', () => toggleSaved(`${duration}-day ${travellerLabel}: ${destination}`, 'itinerary'));
    $('#printItinerary').addEventListener('click', () => window.print());
    $('#sendToConcierge').addEventListener('click', () => {
      $('#chatText').value = `Help me refine this ${duration}-day ${travellerLabel.toLowerCase()} in ${destination}. Style: ${style}. Budget: ${budget}.`;
      $('#concierge').scrollIntoView({ behavior: 'smooth' }); $('#chatText').focus();
    });
  }
  plannerForm.addEventListener('submit', createItinerary);

  // Style studio: simple rules-based suggestions; no shopping products are represented as live.
  const styleNotes = {
    'Beach day': { warm: 'Choose breathable linen or cotton, secure sandals, sunglasses and a hat. Keep a light cover-up handy.', cool: 'Layer a light knit over a comfortable base, add closed-toe shoes and carry a wind-resistant outer layer.', rainy: 'Choose quick-drying layers, a compact rain shell and shoes with reliable grip.', layers: 'Build around a breathable base, an adaptable mid-layer and a packable weather layer.' },
    'Resort evening': { warm: 'Try relaxed tailoring, a flowing dress or a polished co-ord with understated accessories.', cool: 'Use a refined knit or jacket over a simple base, with closed shoes and one considered accessory.', rainy: 'Choose a neat, comfortable outfit with a light waterproof layer and shoes suited to wet paths.', layers: 'Use a clean base outfit and add a tailored layer that works indoors and outdoors.' },
    'City exploring': { warm: 'Keep the palette light, choose breathable separates and prioritise supportive walking shoes.', cool: 'Combine comfortable trousers, a knit and a versatile jacket. A scarf adds warmth without bulk.', rainy: 'Choose a weatherproof outer layer, quick-dry fabrics and grippy shoes.', layers: 'Wear comfortable base layers and carry a compact outer layer for changing conditions.' },
    'Romantic dinner': { warm: 'Choose an elegant breathable silhouette, comfortable footwear and one subtle finishing detail.', cool: 'Add a fine knit, jacket or wrap to a polished base look; plan footwear for the route.', rainy: 'Keep the look refined but practical with a weather-ready coat and secure shoes.', layers: 'Choose a simple base look and one tailored layer that makes the outfit feel complete.' },
    'Long travel day': { warm: 'Soft breathable layers, easy footwear, a light wrap and a small personal-care kit make the journey easier.', cool: 'Use a comfortable base, warm socks, a layer you can remove and supportive shoes.', rainy: 'Choose quick-drying layers, a compact shell and footwear that handles damp conditions.', layers: 'Dress in easy-to-adjust layers and keep a spare top and essential items within reach.' }
  };
  $('#styleStudio').addEventListener('submit', event => {
    event.preventDefault();
    const occasion = $('#styleOccasion').value;
    const direction = $('#styleDirection').value;
    const weather = $('#styleWeather').value;
    const key = weather === 'Warm & sunny' ? 'warm' : weather === 'Cool & breezy' ? 'cool' : weather === 'Rainy / changeable' ? 'rainy' : 'layers';
    const note = styleNotes[occasion][key];
    const result = $('#styleResult'); result.hidden = false;
    result.innerHTML = `<strong>${escapeHtml(occasion)} · ${escapeHtml(direction)}</strong><br>${escapeHtml(note)}<br><br><strong>Finishing note:</strong> Keep colour coordination relaxed, choose pieces that feel comfortable to you, and check the local forecast close to departure. These are styling ideas, not product endorsements.`;
  });

  // Essential checklist, persisted in this browser.
  const checklistState = safeRead(STORAGE.checks, {});
  const checkboxes = $$('[data-check]');
  function renderChecklist() {
    let count = 0;
    checkboxes.forEach(input => {
      input.checked = Boolean(checklistState[input.dataset.check]);
      if (input.checked) count++;
      input.closest('.check-item').classList.toggle('packed', input.checked);
    });
    $('#checkProgress').textContent = `${count} / ${checkboxes.length} PACKED`;
    $('#checkProgressBar').style.width = `${checkboxes.length ? count / checkboxes.length * 100 : 0}%`;
  }
  checkboxes.forEach(input => input.addEventListener('change', () => {
    checklistState[input.dataset.check] = input.checked; safeWrite(STORAGE.checks, checklistState); renderChecklist();
  }));
  $('#checkAll').addEventListener('click', () => { checkboxes.forEach(input => { checklistState[input.dataset.check] = true; }); safeWrite(STORAGE.checks, checklistState); renderChecklist(); showToast('All checklist items marked as packed.'); });
  $('#resetChecklist').addEventListener('click', () => { Object.keys(checklistState).forEach(key => delete checklistState[key]); safeWrite(STORAGE.checks, checklistState); renderChecklist(); showToast('Checklist reset.'); });
  $('#printChecklist').addEventListener('click', () => window.print());

  // Lifestyle essentials buying guide: criteria only, no invented brands, prices or ratings.
  const essentialGuides = {
    luggage: { title: 'Luggage & travel accessories', text: 'Check airline cabin dimensions and weight limits, wheel quality, handle comfort, warranty terms and whether the bag suits the length of your trip.' },
    care: { title: 'Grooming & personal care', text: 'Consider your own skin and hair needs, ingredient sensitivities, refill or travel-size packaging, leak resistance and the climate at your destination. Stop using a product that causes irritation and seek qualified advice when needed.' },
    style: { title: 'Resort style & clothing', text: 'Prioritise breathable fabrics, practical footwear, ease of movement, care instructions and local dress expectations. Choose pieces you feel comfortable wearing rather than buying a look for a photograph.' },
    comfort: { title: 'Personal comfort & protection', text: 'Think about sun protection, hydration, personal hygiene and any lawful protection products relevant to your needs. Check labels and local rules; this guide does not recommend medicines or make health claims.' },
    gifts: { title: 'Thoughtful gifts & experiences', text: 'Look for personal relevance, local craft, clear return terms and transparent pricing. For an experience, confirm what is included, cancellation rules, accessibility and the provider’s current safety information.' }
  };
  $$('.essential-tab').forEach(button => button.addEventListener('click', () => {
    $$('.essential-tab').forEach(tab => tab.classList.toggle('active', tab === button));
    const guide = essentialGuides[button.dataset.esscat];
    $('#essentialGuide').innerHTML = `<span>0${Object.keys(essentialGuides).indexOf(button.dataset.esscat) + 1} / WHAT TO COMPARE</span><h4>${escapeHtml(guide.title)}</h4><p>${escapeHtml(guide.text)}</p><small>VELORA buying guide · General criteria, not a product recommendation</small>`;
  }));

  // Local demo concierge. The interface never claims an external AI model is connected.
  const chatMessages = $('#chatMessages');
  function appendMessage(text, type) {
    const row = document.createElement('div'); row.className = `chat-message ${type}`;
    if (type === 'assistant') { const avatar = document.createElement('span'); avatar.className = 'chat-avatar'; avatar.textContent = 'V'; row.append(avatar); }
    const p = document.createElement('p'); p.textContent = text; row.append(p); chatMessages.append(row); chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  function localConciergeReply(message) {
    const text = message.toLowerCase();
    if (/budget|cost|price|spend/.test(text)) return 'Start by separating transport, accommodation, meals, local travel and activities. Keep a contingency for changes. I cannot check live prices here, so compare current quotes directly with providers before deciding.';
    if (/solo|alone|confidence/.test(text)) return 'For a solo trip, consider a well-connected neighbourhood, daytime arrival, reputable accommodation and a couple of guided group experiences. Share your itinerary with someone you trust and check official local safety guidance.';
    if (/beach|island|coast|honeymoon|romantic/.test(text)) return 'A good beach escape balances the setting with practical details: season, transfer time, swimming conditions, privacy expectations and the kind of pace you both enjoy. Tell me your preferred month, starting point and budget to shape a more useful shortlist.';
    if (/outfit|clothes|fashion|style|pack/.test(text)) return 'Build a small capsule around the destination, forecast and activities: two versatile base looks, one occasion outfit, comfortable walking shoes and a light layer. Check local norms and weather shortly before departure.';
    if (/story|date|connection|relationship/.test(text)) return 'Try an experience that makes room for conversation: a phone-free walk, a shared cooking class, a small gallery or a dinner where you take turns choosing the next course. Ask what feels comfortable for everyone and keep boundaries clear.';
    if (/weather|visa|entry|safety|advisory/.test(text)) return 'Those details change and are not connected to live sources in this demo. Check the destination government, your own government travel advisory, the airline and the relevant embassy or consulate before booking.';
    return 'A useful place to begin is with three things: where you might go, what kind of experience you want, and the budget or dates you need to work within. I can help organise those into a practical outline, but this demo does not access live bookings or external AI.';
  }
  function sendChat(message) {
    const clean = message.trim(); if (!clean) return;
    appendMessage(clean, 'user');
    const reply = localConciergeReply(clean);
    window.setTimeout(() => appendMessage(reply, 'assistant'), 240);
  }
  $('#chatForm').addEventListener('submit', event => { event.preventDefault(); const input = $('#chatText'); sendChat(input.value); input.value = ''; });
  $$('.quick-prompts button').forEach(button => button.addEventListener('click', () => sendChat(button.dataset.prompt)));

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  }
  function downloadText(filename, content) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a');
    link.href = url; link.download = filename; document.body.append(link); link.click(); link.remove(); URL.revokeObjectURL(url);
  }

  // Initial setup.
  $('#year').textContent = String(new Date().getFullYear());
  updateSavedCount(); renderSaved(); syncSaveButtons(); renderChecklist();
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => showToast('Offline support could not be enabled in this browser.')));
  }

  // Hero search routes visitors into the existing full getaway planner.
  const heroSearchForm = $('#heroSearchForm');
  if (heroSearchForm) {
    heroSearchForm.addEventListener('submit', event => {
      event.preventDefault();
      const destination = $('#heroDestination').value.trim() || 'Surprise me';
      $('#planDestination').value = destination;
      const date = $('#heroDate').value;
      if (date) $('#planDate').value = date;
      $('#planTravellers').value = $('#heroTravellers').value;
      $('#planner').scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(() => $('#planDestination').focus({ preventScroll: true }), 450);
      showToast('Your getaway starts with a few thoughtful details.');
    });
  }

})();
