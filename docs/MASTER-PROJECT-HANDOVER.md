# VELORA — MASTER PROJECT HANDOVER SYSTEM

**Version:** 1.9  
**Last updated:** 28 November 2026  
**Project:** VELORA  
**Purpose:** Permanent continuity document for every new ChatGPT conversation

> **This is the project's continuity and operating guide.** Any new assistant or ChatGPT conversation working on VELORA should read this document first, then verify the current repository, live website, Cloudflare and OpenSEO state before making changes. This document records vision and decisions; it is not proof that a feature is currently implemented.



## Strategic source of truth — read this before planning new work

The complete long-term business and product direction is documented in [docs/PRODUCT-NORTH-STAR-AND-LONG-TERM-ROADMAP.md](PRODUCT-NORTH-STAR-AND-LONG-TERM-ROADMAP.md). It defines the international eight-department vision, product thesis, target audiences, Moment-to-Memory user journey, monetization architecture, search strategy, technical direction, safety requirements, roadmap gates and periodic audit scorecard.

The near-term execution plan is in [BUSINESS-PLAN.md](../BUSINESS-PLAN.md). The dedicated marketing and growth operating system is in [docs/GO-TO-MARKET-AND-GROWTH-PLAYBOOK.md](GO-TO-MARKET-AND-GROWTH-PLAYBOOK.md). The latest dated technical baseline is in [docs/FOUNDATION-AUDIT-2026-11-25.md](FOUNDATION-AUDIT-2026-11-25.md).

**Reading order for every new project chat:**
1. This Master Project Handover System.
2. Product North Star & Long-Term Roadmap.
3. Current Business Plan.
4. Go-to-Market, Marketing & Growth Playbook.
5. Latest dated Foundation Audit and continuity update.
6. Verify current GitHub, live website, Cloudflare and OpenSEO state.

The North Star sets the long-term destination. The Business Plan sets the near-term operating sequence. The Foundation Audit records a dated technical snapshot. Do not confuse these different purposes.

---

## 1. सबसे महत्वपूर्ण निर्देश — इस प्रोजेक्ट को कैसे समझना है

तुम VELORA प्रोजेक्ट के Product Architect, Technical Lead, Research Analyst, UX Reviewer और Growth Strategist की भूमिका निभाओगे।

तुम्हारा काम केवल सुझाव देना या कोड लिखना नहीं है। तुम्हें उपलब्ध अधिकृत टूल्स और कनेक्टेड सेवाओं का इस्तेमाल करके वास्तविक प्रोजेक्ट की जाँच, सुधार, परीक्षण और विकास करना है।

हर काम को ऐसे देखो जैसे तुम इस प्रोजेक्ट की तकनीकी गुणवत्ता और दीर्घकालीन सफलता के लिए जिम्मेदार हो।

लेकिन याद रखो:

- वेबसाइट, GitHub, Cloudflare और संबंधित अकाउंट का स्वामित्व उपयोगकर्ता का है।
- उपयोगकर्ता के स्पष्ट निर्णयों और सीमाओं का सम्मान करना है।
- बिना जाँच के यह दावा नहीं करना कि कोई सुविधा बन गई, वेबसाइट ठीक हो गई या कोई बदलाव लाइव हो गया।
- किसी महत्वपूर्ण बदलाव से पहले वर्तमान स्थिति समझनी है।
- हर बदलाव के बाद परीक्षण और सत्यापन करना है।
- उपयोगकर्ता को तकनीकी शब्दों में उलझाने के बजाय सरल हिंदी/Hinglish में परिणाम बताना है।

**सबसे बड़ा नियम:** VELORA को केवल Travel Website मत समझना। Travel इसका एक महत्वपूर्ण विभाग है, पूरा प्रोडक्ट नहीं।

---

## 2. VELORA की मूल पहचान और विजन

VELORA एक अंतरराष्ट्रीय, AI-powered **Romance, Connection & Lifestyle Ecosystem** है।

इसका उद्देश्य लोगों को केवल कोई प्रोडक्ट खरीदने या यात्रा बुक करने में मदद करना नहीं है, बल्कि उनके जीवन के अनुभवों, रिश्तों, व्यक्तिगत शैली, यात्रा, जीवनशैली और मनोरंजक गतिविधियों को एक सुव्यवस्थित डिजिटल प्लेटफॉर्म पर जोड़ना है।

VELORA का अनुभव:

- Premium और भरोसेमंद हो।
- International audience को ध्यान में रखकर बनाया जाए।
- भारत के लोगों को विदेशों में और विदेशों के लोगों को भारत में यात्रा करने में सहायता दे।
- Romance और intimacy जैसे विषयों को सम्मानजनक, सहमति-आधारित और non-explicit तरीके से संभाले।
- केवल दिखने में सुंदर नहीं, बल्कि वास्तविक उपयोगिता वाला हो।
- अलग-अलग विभागों को एक साझा AI Concierge और एकीकृत अनुभव से जोड़े।

**Brand direction:** Premium, cinematic, elegant, modern, warm, trustworthy और international.

**प्रस्तावित visual direction:** Navy, champagne, ivory और coral palette; उच्च गुणवत्ता वाली photography; साफ typography; premium mobile-first experience.

**Interface language:** English. उपयोगकर्ता के साथ बातचीत और प्रोजेक्ट रिपोर्ट सरल हिंदी/Hinglish में हो सकती है।

VELORA नाम फिलहाल working brand है। कानूनी और trademark clearance पूरी तरह सत्यापित नहीं है। उपयोगकर्ता की अनुमति के बिना नाम बदलना या rebrand करना नहीं है।

---

## 3. VELORA के आठ मुख्य विभाग

### 1. Romance & Experiences

- Date ideas और romantic experiences
- Honeymoon और anniversary planning
- Couple activities
- Romantic surprises और special moments
- अलग-अलग बजट और पसंद के अनुसार अनुभव

### 2. Connection & Companionship

- Meaningful connections और companionship discovery
- Social experiences
- Confidence building
- बेहतर संवाद और संबंध बनाने में सहायता

यदि भविष्य में real-person matching या companionship discovery शुरू की जाए तो identity verification, consent, privacy, moderation, safety और कानूनी अनुपालन अनिवार्य होंगे।

### 3. Fashion & Style

- Men, women और couples fashion
- Outfit recommendations
- Grooming और personal styling
- Beachwear और honeymoon looks
- Occasion-based fashion और style inspiration

### 4. Travel & Destinations

यह VELORA का एक प्रमुख विभाग होगा, लेकिन पूरा प्लेटफॉर्म नहीं।

#### A. India Outbound Travel

भारत के लोगों को विदेशों में यात्रा करने के लिए मार्गदर्शन:

- Destinations और travel inspiration
- Visa और entry requirements की जानकारी
- Weather और season
- Hotels और stays
- Transport और local mobility
- Currency, payments और connectivity
- Safety, local culture और practical travel readiness
- Complete trip planning

#### B. International Inbound Travel to India

विदेशी यात्रियों को भारत आने और भारत में घूमने के लिए सहायता:

- India destination discovery
- City, region और experience guides
- Transport, accommodation और local mobility
- Culture, food और etiquette
- Digital payments और connectivity
- Arrival readiness और practical travel information
- Safety और local travel guidance
- भारत के अलग-अलग क्षेत्रों की वास्तविक और उपयोगी जानकारी

दोनों दिशाओं के लिए जानकारी country-specific और current होनी चाहिए। Visa rules, prices, weather, schedules और entry requirements कभी अनुमान से नहीं बताने हैं।

### 5. Lifestyle & Wellness

- Skincare और personal care
- Grooming
- General wellness
- Relationship health
- Responsible sexual-health education
- उपयुक्त lifestyle और wellness products

चिकित्सा संबंधी दावों में सावधानी, विश्वसनीय स्रोत और आवश्यक professional guidance जरूरी है।

### 6. Romance Library

- Romantic stories और novels
- Relationship advice
- Couple activities
- Interactive games
- Conversation prompts
- Digital story collections और activity packs

### 7. AI Creative Studio

- सहमति देने वाले वयस्कों के लिए personalized romantic photography concepts
- Vacation और lifestyle scenes
- Creative concepts और storyboards
- Photo-based creative experiences

किसी व्यक्ति की तस्वीर का दुरुपयोग, बिना सहमति intimate imagery या भ्रामक sexual content नहीं बनाना है।

### 8. VELORA AI Concierge

यह पूरे इकोसिस्टम का intelligent assistant होगा।

इसका उद्देश्य उपयोगकर्ता को अलग-अलग विभागों में भटकाना नहीं, बल्कि उसकी जरूरत समझकर उचित सेवाओं को आपस में जोड़ना है।

उदाहरण:

- Honeymoon plan के लिए destination, stay, outfits और activities सुझाना।
- Couple anniversary के लिए experience, gift और romantic ideas जोड़ना।
- भारत आने वाले विदेशी यात्री के लिए destination, arrival readiness, stay और local experiences जोड़ना।

ध्यान रहे: वर्तमान वेबसाइट में मौजूद demo concierge को वास्तविक AI-powered concierge नहीं मानना है। वास्तविक AI integration का दावा तभी करना है जब backend, model connection, testing और deployment सत्यापित हो जाएँ।

---

## 4. Product Strategy — पूरा Vision, लेकिन सही क्रम में विकास

VELORA का vision व्यापक है, लेकिन एक साथ सभी विभागों को अधूरा बनाकर लॉन्च नहीं करना है।

रणनीति:

1. पहले पूरी वेबसाइट और मौजूदा infrastructure का audit।
2. Core brand identity, navigation और architecture को मजबूत करना।
3. Travel विभाग को एक उपयोगी, भरोसेमंद और differentiated experience के रूप में विकसित करना।
4. ऐसा architecture रखना जिसमें बाकी सात विभाग बाद में व्यवस्थित रूप से जोड़े जा सकें।
5. Concierge और shared user experience को धीरे-धीरे वास्तविक बनाना।
6. हर नए विभाग को research, user value, technical feasibility और monetization के आधार पर विकसित करना।

किसी एक विभाग को बेहतर बनाना पूरे VELORA की पहचान बदलने का कारण नहीं होना चाहिए।

Travel की market research या competition analysis के आधार पर VELORA को travel-only brand में कभी सीमित मत करना।

---

## 5. वर्तमान तकनीकी स्थिति — पिछली जाँच के आधार पर

इन जानकारियों को पुराना technical baseline समझना है, वर्तमान स्थिति का प्रमाण नहीं। हर नई development session में वास्तविक repository और live deployment की जाँच करनी है।

### Known project details

- Website: https://velora-75y.pages.dev/
- GitHub repository: `trivedishaan930-sketch/VELORA`
- Cloudflare Pages project name: `velora`  
- Cloudflare Pages production hostname: `https://velora-75y.pages.dev/`
- OpenSEO project ID: `18e3573d-194a-4456-ad0e-0ca4f7dac95d`
- Google Search Console: पिछली जानकारी के अनुसार connected नहीं था।

### Previously inspected website structure

एक polished one-page website थी जिसमें ये sections मौजूद थे:

- Hero
- Welcome
- Audience
- Explore Destinations
- Experience Band
- Planner
- Style
- Essentials
- Shop
- Stories
- Concierge
- Wellness
- Safety
- Closing

### Previously identified limitations

- Planner generic templates पर आधारित था।
- Destination input से वास्तविक destination-specific data अपने आप नहीं मिलता था।
- वास्तविक routes, transit times, live prices और weather integration की पुष्टि नहीं थी।
- Concierge local rule-based demo था, connected AI service नहीं।
- Saved lists और checklists browser-local थीं, verified server accounts नहीं।
- Shop placeholder था; full live commerce integration की पुष्टि नहीं थी।
- Cloudflare Pages Functions और D1 backend का शुरुआती ढाँचा तथा Amazon Creators API integration skeleton पहले जोड़ा गया था, लेकिन production configuration पूरी होने की पुष्टि नहीं थी।

### Repository में पहले किए गए काम

पिछली जाँच के अनुसार repository में build scripts, Cloudflare Pages Functions backend, D1 schema, Amazon API integration skeleton, private product desk, catalogue UI, quality workflow और setup documentation जोड़े गए थे।

इनमें से किसी भी सुविधा को केवल पुराने विवरण के आधार पर production-ready नहीं मानना है। GitHub और Cloudflare में वास्तविक स्थिति फिर से देखनी है।

---

## 6. हर नई Chat में काम शुरू करने से पहले अनिवार्य Audit

जब भी नई चैट शुरू हो, सीधे नया कोड लिखने या डिजाइन बदलने मत लग जाना।

पहले निम्न जाँच करो:

### A. GitHub Audit

- Repository सही है या नहीं।
- Latest commits और branches।
- Current file structure।
- Existing components और pages।
- Build scripts और dependencies।
- Functions और backend।
- D1 schema और database migrations।
- Secrets और configuration references।
- कोई अधूरा या duplicated implementation तो नहीं।
- पहले के बदलावों से कुछ टूट तो नहीं गया।

### B. Live Website Audit

- Live website खुलती है या नहीं।
- Mobile और desktop experience।
- Navigation और सभी links।
- Forms और interactive components।
- Images, layout और loading issues।
- Console या build errors, जहाँ निरीक्षण संभव हो।
- SEO metadata और page structure।
- वास्तविक functionality और demo functionality के बीच स्पष्ट अंतर।

### C. Cloudflare Audit

- सही Pages project और deployment।
- Latest successful deployment।
- Build configuration।
- Environment variables और bindings।
- D1 database configuration।
- Pages Functions।
- Required secrets की availability; secret values को कभी प्रदर्शित या कॉपी नहीं करना।
- Production और preview environment में अंतर।

### D. OpenSEO Audit — इसे नजरअंदाज नहीं करना

OpenSEO project का उपयोग करके VELORA की search visibility और SEO स्थिति नियमित रूप से जाँचनी है।

जाँच में शामिल हों:

- Site health और technical SEO।
- Indexability और crawlability।
- Title और meta descriptions।
- H1/H2 structure।
- Internal linking।
- Image alt text।
- Page content और topical relevance।
- Keyword opportunities।
- Search intent और content gaps।
- Travel तथा अन्य विभागों के लिए अलग-अलग search opportunities।
- Competitor analysis।
- AI search visibility और brand mentions, जहाँ उपलब्ध हों।
- Search Console data, जब connection उपलब्ध हो।

पिछली OpenSEO जाँच में live site indexable थी और title/meta मौजूद थे। एक warning में crawler को सामान्य outgoing/internal links की कमी दिखाई दी थी क्योंकि navigation मुख्यतः anchor sections पर आधारित थी। वर्तमान स्थिति फिर से जाँचनी है।

OpenSEO की recommendations को blindly लागू नहीं करना है। हर recommendation को वास्तविक product vision और user value से मिलाकर देखना है।

---

## 7. Development का अनिवार्य तरीका

हर feature या सुधार के लिए यह क्रम अपनाना है:

**Step 1 — Inspect:** पहले संबंधित code, dependencies और वर्तमान व्यवहार देखो।

**Step 2 — Understand:** यह बदलाव किस समस्या को हल करेगा और किन दूसरे हिस्सों को प्रभावित कर सकता है, समझो।

**Step 3 — Research:** जहाँ current information, competitors, regulations, APIs, prices या technical documentation आवश्यक हों, वहाँ विश्वसनीय current sources जाँचो।

**Step 4 — Plan:** छोटा और स्पष्ट implementation plan बनाओ।

**Step 5 — Implement:** न्यूनतम आवश्यक बदलाव करो। बिना कारण पूरी वेबसाइट को फिर से न बनाओ।

**Step 6 — Test:** Build, functionality, mobile layout और संबंधित flows जाँचो।

**Step 7 — Review:** पुराने features और दूसरे departments पर unintended असर तो नहीं पड़ा, इसकी जाँच करो।

**Step 8 — Commit/Deploy:** अधिकृत GitHub और Cloudflare workflows से बदलाव सुरक्षित करो। Production deployment से पहले risk और authorization की स्थिति देखो।

**Step 9 — Verify:** Live website पर वास्तविक बदलाव की पुष्टि करो।

**Step 10 — Report:** क्या बदला, क्या जाँचा, क्या सफल रहा और क्या अभी बाकी है—सरल भाषा में बताओ।

अधूरा काम complete बताना मना है।

एक साथ बहुत सारे असंबंधित बदलाव मत करना। चरणबद्ध, परीक्षण योग्य सुधार करना।

---

## 8. Design और User Experience के नियम

हर पेज और विभाग में:

- Premium और consistent design system।
- Mobile-first responsive layout।
- आसान और स्पष्ट navigation।
- तेज loading और optimized images।
- अच्छी typography और पर्याप्त spacing।
- Accessibility और readable contrast।
- भरोसेमंद content और स्पष्ट calls to action।
- कोई नकली rating, review, testimonial या feature नहीं।
- Dead buttons और दिखावटी interactive features नहीं।
- Demo data को live verified data की तरह प्रस्तुत नहीं करना।

सिर्फ सुंदर interface बनाना सफलता नहीं है। हर element का वास्तविक उपयोग होना चाहिए।

---

## 9. Trust, Safety, Privacy और Compliance

VELORA का आधार भरोसा है।

- Platform 18+ positioning के साथ विकसित किया जाए।
- Romance और intimacy content non-explicit, consent-based और respectful हो।
- Pornography, escort या sexual-services marketplace की दिशा में न बढ़ना।
- Real-person interaction में verification, reporting, moderation और privacy का ध्यान।
- Health और wellness में unsupported medical claims नहीं।
- Travel में visa, entry, emergency और safety जानकारी के लिए current reliable sources।
- User data न्यूनतम संग्रहित हो और आवश्यकता से अधिक साझा न हो।
- Payment और personal information के लिए सुरक्षित systems।
- Copyrighted photos, stories, branding या content का अनुचित उपयोग नहीं।
- जहाँ कानून, platform policies या regulatory requirements लागू हों, उन्हें जाँचना अनिवार्य है।

### Security

- Password, API key, access token और private secrets कभी GitHub code में नहीं डालना।
- Secrets केवल सुरक्षित environment/Cloudflare Secrets में रखने हैं।
- Amazon या अन्य API credentials चैट में साझा नहीं करने हैं।
- Database और user data के लिए उचित access control रखना है।
- किसी sensitive operation से पहले backup और rollback strategy देखनी है।

---

## 10. Monetization — पूरे Ecosystem के अनुसार

VELORA को केवल travel affiliate links पर निर्भर नहीं रखना है।

संभावित revenue streams:

- Travel, hotel, activities, eSIM और अन्य relevant partnerships।
- Fashion, grooming, beauty और lifestyle affiliate products।
- Wellness products, applicable policies के अनुसार।
- Digital relationship activity packs और story bundles।
- Style guides, travel readiness guides और अन्य digital products।
- Premium AI Concierge।
- Premium creative experiences।
- Future subscription या membership features।

हर monetization idea को तीन सवालों पर जाँचना है:

1. क्या इससे उपयोगकर्ता को वास्तविक फायदा होगा?
2. क्या यह VELORA की brand identity से मेल खाता है?
3. क्या इसे कानूनी, नैतिक और तकनीकी रूप से सही तरीके से लागू किया जा सकता है?

सिर्फ commission के लिए खराब product या भ्रामक recommendation नहीं देनी है।

Amazon Associates India की उपलब्धता को international marketplace earning की स्वतः अनुमति नहीं मानना है। प्रत्येक marketplace और API eligibility को अलग से सत्यापित करना होगा।

---

## 11. Branding और Domain बदलने की भविष्य की योजना

उपयोगकर्ता ने भविष्य में नाम या branding बदलने की संभावना स्वीकार की है, लेकिन अभी rebrand का निर्णय नहीं लिया है।

महत्वपूर्ण technical understanding:

- केवल brand name बदलने पर नया GitHub repository बनाना जरूरी नहीं।
- सामान्यतः उसी codebase में branding, logo, texts और design बदले जा सकते हैं।
- नया `pages.dev` slug चाहिए तो नया Cloudflare Pages project बनाना पड़ सकता है।
- उसी existing GitHub repository को नए Pages project से जोड़ा जा सकता है।
- पहले नया deployment test करना है।
- पुरानी live website को तब तक नहीं हटाना जब तक नया version पूरी तरह verify न हो जाए।
- Custom domain और trademark निर्णय उपयोगकर्ता की स्पष्ट मंजूरी और उचित clearance के बाद ही लेने हैं।

अभी VELORA के नाम और identity को बनाए रखना है।

---

## 12. Research और Decision-Making Rules

जब भी किसी नए विभाग या feature पर काम हो:

- वास्तविक market और competitor research करो।
- केवल popular होने के कारण feature मत जोड़ो।
- User needs और search intent समझो।
- Free और paid alternatives देखो।
- Technical feasibility और maintenance cost का आकलन करो।
- Official sources से rules और policies verify करो।
- Assumptions और verified facts को अलग रखो।
- जहाँ जानकारी उपलब्ध न हो, साफ बताओ।
- एक ही बार में बहुत अधिक features जोड़कर quality कम मत करो।

AI का काम केवल कल्पनाशील ideas देना नहीं, बल्कि उन ideas को वास्तविक product decisions में बदलना है।

---

## 13. User के साथ संवाद का तरीका

उपयोगकर्ता सरल हिंदी/Hinglish में संवाद पसंद करते हैं।

इसलिए:

- सीधी और स्पष्ट बात करो।
- अनावश्यक लंबे technical lectures नहीं।
- जब कोई technical issue आए तो उसका वास्तविक कारण और practical समाधान समझाओ।
- किसी पुराने निर्णय को बार-बार न पूछो, यदि वह इस document या conversation में स्पष्ट है।
- केवल वास्तव में जरूरी clarification पूछो।
- काम कर सकते हो तो केवल सलाह देकर मत रुकना; उपलब्ध अधिकृत tools से वास्तविक काम करो।
- लेकिन tool access न हो तो अपनी सीमा स्पष्ट बताओ।
- Background में काम करने या बाद में परिणाम देने का झूठा वादा मत करो।

---

## 14. Permanent Project Continuity Protocol

यह section हर अगली ChatGPT conversation के लिए अनिवार्य है।

इस document को पढ़ने के बाद:

1. पहले VELORA का मूल vision और आठों विभाग समझो।
2. पिछले conversation का latest decision उपलब्ध हो तो उसे पढ़ो।
3. पुराने technical status को verified current status मत मानो।
4. GitHub, live website, Cloudflare और OpenSEO की वर्तमान स्थिति जाँचो।
5. इस document के बाद उपयोगकर्ता ने जो नया निर्णय दिया है, उसे प्राथमिकता दो।
6. किसी पुराने assistant के गलत सुझाव को केवल इसलिए जारी मत रखो कि वह conversation में था।
7. उपयोगकर्ता के स्पष्ट निर्णय के बिना VELORA को travel-only platform या किसी दूसरे brand में मत बदलो।

### हर काम के बाद Continuity Log बनाओ

इस प्रारूप में छोटा लेकिन सटीक record तैयार करो:

**VELORA CONTINUITY UPDATE**

- Date:
- Current project stage:
- Work completed:
- GitHub changes/commit:
- Cloudflare deployment status:
- Live website verification:
- OpenSEO findings:
- Problems discovered:
- Problems fixed:
- Pending tasks:
- Decisions made by user:
- Decisions awaiting user approval:
- Next exact action:

इस log को अगली नई चैट में Master Handover System के साथ इस्तेमाल करना है।

हर नए version में पुराने महत्वपूर्ण निर्णय और जानकारी हटानी नहीं है। केवल verified नए facts जोड़ने हैं।

---

## 15. पहली प्राथमिकता — अब वास्तव में क्या करना है?

इस Master Handover System को पढ़ने के बाद सीधे redesign या बड़े बदलाव शुरू मत करना।

पहला चरण एक पूर्ण **VELORA Foundation Audit** होगा:

1. GitHub repository की current स्थिति जाँचो।
2. Live Cloudflare website की जाँच करो।
3. Existing code और वास्तविक functionality का मिलान करो।
4. Cloudflare backend, Functions और D1 की स्थिति देखो।
5. OpenSEO project में वर्तमान SEO, keyword और visibility data देखो।
6. पूरे VELORA vision के विरुद्ध website की कमियाँ पहचानो।
7. एक priority-based improvement roadmap तैयार करो।

Audit में हर चीज को इन तीन श्रेणियों में बाँटो:

- **Working:** वास्तव में काम कर रही सुविधाएँ।
- **Incomplete:** मौजूद हैं, लेकिन अधूरी या demo स्थिति में हैं।
- **Missing:** अभी बनाई ही नहीं गई हैं।

इसके बाद सबसे जरूरी और उपयोगी सुधार से काम शुरू करो। हर चरण में quality, security, SEO, mobile experience और long-term maintainability को ध्यान में रखो।

**अंतिम लक्ष्य:** VELORA को केवल एक अच्छी दिखने वाली वेबसाइट नहीं, बल्कि एक विश्वसनीय, उपयोगी, अंतरराष्ट्रीय और विस्तार योग्य AI-powered Romance, Connection & Lifestyle Ecosystem बनाना है।

**याद रखो: VELORA का Vision बड़ा है। विकास व्यवस्थित होगा। गुणवत्ता से समझौता नहीं होगा।**

---

## 16. अगली ChatGPT Chat में उपयोग करने के लिए निर्देश

नई चैट में इस repository का यह दस्तावेज़ पढ़ने के बाद निम्न निर्देश का पालन करना है:

> यह VELORA का Master Project Handover System है। इसे पूरा पढ़कर इसी के अनुसार काम आगे बढ़ाओ। पुराने निर्णयों और मूल vision को ध्यान में रखो। पहले वर्तमान GitHub, Live Website, Cloudflare और OpenSEO की वास्तविक स्थिति का audit करो। बिना जाँच के कोई पुरानी जानकारी सही मत मानना। Audit के बाद priority-based roadmap बनाकर काम आगे बढ़ाओ। हर काम का Continuity Update तैयार करना ताकि अगली चैट में project continuity बनी रहे।

**Recommended repository path:** `docs/MASTER-PROJECT-HANDOVER.md`

**Recommended GitHub link:**  
https://github.com/trivedishaan930-sketch/VELORA/blob/main/docs/MASTER-PROJECT-HANDOVER.md


### Audit follow-up correction (25 Nov 2026)

Correction verified from GitHub Actions history (25 Nov 2026): the existing Cloudflare Pages project name is `velora`; its configured production hostname is `velora-75y.pages.dev`. Run `45614874702` successfully executed `pages deploy dist --project-name=velora --branch=main` and returned a preview URL under `velora-75y.pages.dev`. Later run `45619408206` failed with Cloudflare error 8000007 only after the workflow incorrectly targeted `--project-name=velora-75y`. The issue was a project-name/hostname mix-up, not TinyFish or invalid API credentials. TinyFish was only relevant to visual dashboard inspection. The workflow and `wrangler.toml` were restored to project name `velora`; `SITE_ORIGIN` remains `https://velora-75y.pages.dev`. Corrected run `45626274386` successfully deployed using Wrangler 4.168.0. The subsequent run `45626553816` also succeeded and its live smoke tests passed for homepage/title/canonical, robots, sitemap and `/api/health`. API health returned `ok=true`, but `databaseConfigured=false` and `amazonCreatorsApiConfigured=false`; the catalogue backend is therefore not yet operational. GitHub Pages automatic deployment has been switched to manual-only.


### Product continuity update — first travel-guide release (25 Nov 2026)

The first crawlable travel product release is live on Cloudflare Pages:
- `https://velora-75y.pages.dev/travel/` — Travel Hub.
- `https://velora-75y.pages.dev/travel/india-arrival-ready/` — international visitors arriving in India.
- `https://velora-75y.pages.dev/travel/first-international-trip/` — Indian travellers preparing for their first trip abroad.

Release commit: `1e3e0f67d97a250df35860a2be9d58d3d9e43835`. Quality run `45629441107` and production deploy/smoke run `45629441223` passed. GitHub now tests all three live paths, their page titles/canonicals, sitemap entries, homepage, robots and API health after every deployment. The two detailed guides have browser-local checklists that store checkbox IDs only; no passport or itinerary data is sent to VELORA.

Build now copies the `travel/` route tree, guide styles and checklist script; sitemap lists the homepage and all three guide routes; PWA cache is `velora-shell-v6`. Travel sources and volatile-fact review policy are in `docs/TRAVEL-GUIDE-RESEARCH.md`.

**Current backend limitation remains:** `/api/health` returns `ok=true`, `databaseConfigured=false` and `amazonCreatorsApiConfigured=false`. The product catalogue / Amazon affiliate backend is not operational. Search Console also still needs founder-side property authorisation.

**Next exact work:** inspect D1 availability and existing Pages bindings read-only, without printing credentials or customer data. If a suitable database is absent, document the precise founder action rather than silently creating a new resource. Then improve the trip-planning tool with transparent user-entered budget calculations, followed by the next validated guide cluster.


### Product continuity update — Trip Budget Planner release (25 Nov 2026)

Live page: `https://velora-75y.pages.dev/travel/budget-planner/`. Release commit: `a1470700f7630bbd1f6b55b0c30a21c2ab7ebf83`. The tool lets a visitor estimate group trip costs, per-person/per-day amounts, contingency and budget headroom using only user-entered numbers. It formats amounts in a selected currency but performs no FX conversion and fetches no provider prices. Draft save/load is explicit and local to the visitor's browser. No budget data is sent to VELORA.

The current Travel Hub now links to all three guides plus the budget planner. GitHub quality checks run `45631337580` and Cloudflare production smoke run `45631337353` passed. The latter verifies homepage and all four travel pages, canonical URLs, sitemap routes, robots and API health. Sitemap now contains the homepage plus four crawlable travel routes/tools.

### D1 diagnostic and permission boundary (25 Nov 2026)

Read-only D1 inventory workflow run `45630168174` returned Cloudflare API error `10000` at `/accounts/.../d1/database` using the existing Pages deployment token. Pages deployments remain healthy. Cloudflare permissions distinguish D1 Read and D1 Edit; create a separate account-limited D1 Read token and store it only as GitHub Actions secret `CLOUDFLARE_D1_READ_TOKEN`. The D1 inventory workflow is manual-only and now uses that separate secret. The Pages deployment token must remain unchanged. Do not create or bind a database until the existing inventory is known and the founder approves the exact action.

**Current status:** API health `ok=true`, `databaseConfigured=false`, `amazonCreatorsApiConfigured=false`. Search Console property authorisation is also still pending.

**Next exact action:** user-side creation of the separate D1 Read token + GitHub secret, followed by a manual inventory run. Thereafter assess D1 binding and schema migration only against the verified existing database inventory.

### Occasion-aware getaway planner upgrade — 25 November 2026

- **Feature:** The homepage getaway planner now asks what the trip is for and produces an occasion-aware outline rather than only cycling through generic travel-style prompts.
- **Occasions:** Romantic escape, honeymoon/newlywed journey, anniversary/milestone, proposal/special celebration, first trip together, solo reset, friends' escape and family holiday.
- **User value:** Day-by-day prompts adapt to the selected occasion and travel style. The output includes a practical comfort/preparation reminder, direct links to the Trip Budget Planner and Travel Hub, and retains local save, print/PDF and concierge hand-off.
- **Safety and privacy:** The proposal guidance explicitly avoids public pressure and leaves room for a freely chosen response. The planner remains browser-generated; it does not send the user's destination, dates or budget to a VELORA server. Output is inspiration, not a verified itinerary, live price or reservation.
- **Quality gate:** scripts/check.mjs now checks the occasion selector and all eight blueprint keys. The Cloudflare production smoke test now checks that the live homepage includes the selector. The resulting quality/deployment run must be checked against the latest main commit before claiming release verification.
- **Supporting cleanup:** Root robots.txt and sitemap.xml source copies were aligned with the current production hostname and all five crawlable routes. The Cloudflare build continues to generate its own dist/robots.txt and dist/sitemap.xml from SITE_ORIGIN.
- **Latest implementation commit at the time of this note:** d18af1d853a39b485f6c5adb822ca01101035dd1. Verify the latest commit and Actions before the next change.

## Founder-authorised autonomous execution mandate — 25 November 2026

**Permanent operating plan:** [docs/VELORA-AUTONOMOUS-EXECUTION-PLAN.md](VELORA-AUTONOMOUS-EXECUTION-PLAN.md). Read this before any new VELORA implementation session, together with the Product North Star and current source state.

The founder explicitly approved the comprehensive improvement direction covering brand / photography, visual system, information architecture, all eight department status, product/backend truthfulness and SEO/content architecture. The founder authorised the assistant to make appropriate routine product, UX/UI, design, code, content architecture, testing, documentation and existing GitHub / authorised deployment changes autonomously, without repeatedly asking routine questions.

**Founder instruction for future conversations:** the next conversation is expected to receive independent audits from Manus, Grok and Claude. Read all three in full, compare claims against current repository and live evidence, synthesise consensus and disagreements, then implement the highest-priority founder-aligned changes. After the audit synthesis, the founder's standing trigger is **VELORA PUSH**. Interpret it as: inspect latest state → choose next highest-impact safe task → implement → test → deploy if verified and authorised → update the plan and handover → report actual outcome.

**Important image decision:** the founder rejected the previous shirtless / bikini-style swimwear hero image. The earlier instruction to preserve that exact photograph has been superseded. Do not reuse bikini/swimwear, lingerie/underwear-coded styling, shirtless male models, cleavage/midriff emphasis or suggestive poses in public VELORA art direction. Future campaign imagery must be fully clothed, tasteful, premium editorial / quiet luxury, and must not repeat the same image across multiple sections. See DESIGN-DECISIONS.md and ASSET-SOURCES.md.

**Autonomy boundaries:** safe reversible source, design, UX, tests, docs and existing GitHub changes are authorised. Do not spend money, create or alter accounts/domains, enter contracts, change secrets, expose credentials, make destructive database changes, enable payments/bookings or launch public matching / user-generated content without the required specific approval and privacy, security, safety and legal readiness.

**Quality standard:** do not optimise for number of commits or pages. A release is complete only after applicable design, accessibility, responsive, functionality, privacy, SEO, build, CI and production smoke gates pass. A successful commit alone is not proof of a live release.

**Plan file commit:** 2c32b5a9175f74fccc1b3d173f5bfa4e731bb2d8.

## Three-AI audit received and synthesised — 26 November 2026

Founder supplied the full Manus audit attachment, full Grok report and Claude summary. All were reviewed and reconciled with current source. Permanent synthesis: `docs/MULTI-AI-AUDIT-SYNTHESIS-2026-11-26.md`. The autonomous operating plan now links the resulting execution priorities.

**Top execution priorities:** replace the rejected public hero in every reference/cache; fix the 390/360px floating CTA collision and tiny mobile controls; re-architect the long homepage around the full ecosystem and a small number of user intentions; remove duplicate imagery/repeated messages; prevent destination/style mismatch (Manus tested Kyoto + Beach & coast); connect planner → budget → guide → checklist → save/print; create genuine privacy/terms/safety routes; de-emphasise inactive Shop; keep Concierge truthfully labelled demo; harden the token-gated admin pathway before activating catalogue.

**Important evidence nuance:** Claude raised an admin-page protection question but did not claim it had verified a vulnerability. Source review confirms the admin HTML is publicly addressable, while server-side admin functions require a Bearer token and D1. `noindex` alone is not security; review rate limiting/access-layer hardening before activation. Manus's 25 Nov live observations and same-SHA workflow pass refer to the inspected 73852... snapshot; do not project that status onto later commits without checking them.

**User expectation:** do not ask the founder to restate the brief or approve routine reversible source changes. On each `VELORA PUSH`, read the operating plan and audit synthesis, inspect current main/live state, implement the highest-priority safe task, verify tests/deployment and keep these documents current.

---

## Verified execution continuity update — 26 November 2026

The 26 November Manus/Grok/Claude findings were checked against the latest source and live Cloudflare release. This update supersedes the pre-implementation status above where facts conflict.

### Current verified release

- Latest product/policy source commit: `54d541f212cfd388bce9e3f5c13e956b7ae03d07`.
- Quality workflow `45745139602`: passed on that exact commit.
- Cloudflare Pages deployment and production smoke workflow `45745139545`: passed on that exact commit.
- Active production host remains `https://velora-75y.pages.dev`; Pages project name remains `velora`.
- The earlier successful same-SHA metadata release is commit `38c31ef5e34ef4bf180720675201de77905594cf`, quality run `45745007199`, deployment run `45745007245`.

### Work completed and source-verified

1. Replaced the rejected hero reference with the approved editorial SVG in the homepage and social preview; the old rejected JPG is not referenced by the homepage or service-worker core cache. The service-worker cache is versioned `velora-shell-v9`.
2. Simplified homepage navigation and content around the complete eight-department VELORA ecosystem, three user-intent paths and honest Live / Demo / Editorial / Preview / Future states. The redundant hero quick-search and inactive Concierge/chat shell are removed.
3. The floating Concierge CTA is hidden at mobile breakpoints; mobile form inputs use a readable 16px minimum. A live browser check at exact 390×844 and 360×800 was not possible in this run, so do not mark exact-device visual QA as passed.
4. Added conservative destination/style conflict guidance. A live browser test with Kyoto + Beach & coast displayed a clear choice; choosing Culture & city resolved the mismatch.
5. Implemented the user-triggered, browser-local planner-to-budget handoff with destination, occasion, duration, traveller count, currency and optional ceiling. The budget page contains the context notice and makes clear that entered amounts are not live quotes. The browser automation did not conclusively perform the Continue-button navigation end-to-end; the implementation is source-checked and the production smoke test checks the receiving route/context.
6. Added distinct crawlable Privacy, Terms and Safety pages. Corrected the policy wording so AI Concierge is consistently described as a future capability, not an available browser demo or connected AI.
7. Shortened the homepage, budget-planner, first-international-trip and India-arrival meta descriptions to 133–137 characters; shortened the first-trip page title from 61 to 43 characters. Added automated title (maximum 60 characters) and description (70–160 characters) checks for homepage, travel and policy routes.

### Live foundation audit on 26 November

OpenSEO crawl `c76b2f7f-e50b-433f-9d53-8642997c886a` completed all 8 sitemap URLs. Every crawled page returned HTTP 200 and was marked indexable; every page had one H1 and zero images missing alt text. The baseline crawl reported only five informational metadata-length warnings (four descriptions and one title), which have since been corrected in source and deployed. No broken-page, missing-title, missing-H1 or missing-alt issue was returned.

The production `/api/health` endpoint still reports `ok=true`, `databaseConfigured=false` and `amazonCreatorsApiConfigured=false`. Do not claim database-backed accounts, catalogue, Amazon API, payments or bookings are active.

### Reporting limitations and founder-side dependencies

- OpenSEO project VELORA still targets `trivedishaan930-sketch.github.io`, not the verified production host `velora-75y.pages.dev`. No project-domain edit action was available in this session; correct the OpenSEO project target in its settings before interpreting rankings.
- Google Search Console is not connected to this OpenSEO project. No first-party click, impression, CTR or average-position claims can be made until the owner connects the correct property: `https://app.openseo.so/p/18e3573d-194a-4456-ad0e-0ca4f7dac95d/search-performance`.
- Exact mobile screenshots at 390×844 and 360×800 and the complete Continue-to-budget interactive transition remain unverified by browser automation. Do not overstate those tests.
- D1 inventory remains blocked until the founder creates the separate least-privilege D1 Read token and stores it as `CLOUDFLARE_D1_READ_TOKEN`, as described above. Do not modify the Pages deployment token or create a database without approval.

### Next execution priorities

1. Re-run the OpenSEO crawl after the latest policy/metadata release and confirm zero metadata-length issues.
2. Complete exact mobile viewport visual QA and one genuinely end-to-end planner → budget → guide/checklist test.
3. Correct the OpenSEO tracked hostname and connect Search Console.
4. Continue the route-aware offline experience and improve destination-specific preparation while retaining truthful live-data boundaries.
5. Inspect D1 read-only only after the founder-side token is available; keep catalogue, affiliate API, payments and accounts disabled until independently verified.

Continue autonomously on safe, reversible source, UX, content and test work. Never invent the missing live/mobile/GSC/D1 evidence.

---

## Visual refinement continuity update — 26 November 2026

This is the response to the founder's mobile screenshots and renewed direction for a premium, classic VELORA identity. It supersedes the earlier statement that the editorial hero SVG was an acceptable transition for the live homepage.

### Screenshot diagnosis

- Both supplied phone screenshots visibly displayed **"No internet connection"** in the browser status area. Offline state was a contributing factor to missing network-fetched visuals.
- The hero illustration was genuinely an interim SVG with simplified human figures; it was not an appropriate final premium hero and has been removed from the public asset folder.
- The destination cards were not merely failing to load: their HTML contained no image elements. The original Maldives, Amalfi and Kyoto WebP assets existed in the repository but were never attached to those cards.
- The three audience-intent cards were intentionally gradient-only and the section included a large decorative panel. That produced large empty blocks, so the decorative panel has been removed and the cards restyled as compact editorial surfaces.

### Work implemented and deployed

- Hero now uses the existing project asset `public/assets/experiences/couple-sunset-walk.webp`, an AI-generated, fully clothed editorial scene. This is project artwork, not customer or first-hand travel photography.
- Added the three existing destination WebP images back into the Maldives, Amalfi Coast and Kyoto card markup with descriptive alt text and lazy loading.
- Removed the oversized audience visual panel and changed the three audience cards from large dark gradients to light, bordered editorial cards.
- Replaced the announcement strap text `MADE FOR ADULTS` with **THOUGHTFUL EXPERIENCES. BEAUTIFULLY CONSIDERED.** The adult-oriented product boundary remains in the relevant policy/safety copy rather than the top brand message.
- Simplified typography to Playfair Display + DM Sans (removed the redundant Manrope font request). Enlarged desktop navigation, buttons, form labels and body copy; changed CTA text to normal title/sentence case and introduced a consistent rectangular gold/outline button style.
- Rebalanced homepage width, desktop navigation, hero, destination cards, audience cards and mobile breakpoints.
- Deleted the temporary SVG hero from `public/assets/hero/` and removed its Open Graph/Twitter references.
- Updated Service Worker cache to `velora-shell-v10`. The four current homepage photos are precached individually so one optional image failure cannot cancel installation of the whole image cache.
- Updated repository tests, production workflow smoke checks, design decisions and asset-source register. The Cloudflare workflow now makes real HTTP requests for all four homepage image assets.

### Release and verification evidence

- Visual source commit: `b792054dc64ccb4b0594015e117a3222c6750d3e`. Its first check attempt exposed a stale test assertion for the retired SVG; the deployment did not proceed on that failed run.
- Corrected test/design documentation commit: `b46767e90bc3c66f23f3610d5c38c9f1d57a4421`. Quality run `45747150893` passed and Cloudflare deployment `45747150871` passed.
- Image-response smoke-test commit: `74e0647ac44ca8dfabb8aab2d464a850198e903f`. Quality run `45747300582` passed; Cloudflare deploy and production image/route smoke run `45747300644` passed. The run made successful HTTP requests for the hero image and all three destination WebP files, plus the existing route, robots, sitemap and API checks.
- Latest OpenSEO crawl: `a3f39ce6-7cc4-43f4-95c5-312d9bd95689`. It crawled 8/8 sitemap pages; all returned HTTP 200 and were indexable; each page has one H1; the homepage now reports four images; zero images are missing alt text; total crawl issues: zero.

### Honest visual QA limits

- Exact browser screenshots at desktop 1440px, mobile 390×844 and 360×800 have not yet been captured. Source breakpoints and CSS have been updated, but do not label real-device visual QA as passed.
- The founder's captured browser showed no internet connection. To receive the new Service Worker and offline photo cache, open the live site once while online and refresh so cache v10 can install; afterwards test offline again.
- The similar-name reference `velora.pages.dev` is a separate beauty/cosmetics storefront, not this business. It is a general reference only; do not copy its brand, products, content, reviews or exact layout.
- The existing hero is an interim AI-generated project image. Future photography may be commissioned/generated as a coherent asset library, with distinct scenes and no repeated hero image across sections.

### Next priority order

1. Complete actual desktop and 390×844 / 360×800 screenshot QA after the founder refreshes once online.
2. Refine further based on those screenshots, and create a coherent high-resolution photography/art direction for the remaining departments without image repetition.
3. Consolidate the existing long CSS cascade into a maintained design-token/component layer; this pass added a final coherent override block but did not yet fully refactor every historical rule.
4. Correct the OpenSEO tracked hostname to `velora-75y.pages.dev` and connect the correct Google Search Console property.
5. Continue only with safe UX/content improvements; D1, Amazon API, accounts, catalogue, payments and bookings remain gated and unconfigured.

---

# Current release update — budget-to-preparation flow (26 November 2026)

The main branch now connects the browser-local Trip Budget Planner to the appropriate existing travel-preparation guide:

- After the visitor calculates an estimate, the page offers separate next steps for visiting India or travelling abroad from India.
- Only optional destination, trip length and traveller count are passed in a 30-minute, one-time local browser handoff. Costs, budget/currency figures and personal identity details are not passed.
- The selected guide displays the summary as a planning reminder, not a verified travel requirement. Checklist ticks remain separate and local.
- Privacy wording and responsive styling were updated.
- Service worker is v13. A deployment defect was found and fixed: the build script had omitted `sw.js` from `dist`. The build now copies and verifies the worker, and Cloudflare Pages applies explicit revalidation headers to `/sw.js`.
- Verified main commit: `9d4bb370957be95ef1f033b0ae82af6582201c64`.
- Quality run `45760052581` and Cloudflare deployment/live smoke run `45760052539` both succeeded.

Still not configured: D1 binding `DB`, Amazon Creators API credentials/eligibility, Google Search Console ownership and real browser/device end-to-end QA. Do not claim product inventory, live prices, bookings, accounts or synced user plans are operational.

---

# PWA/offline shell release — 28 November 2026

- Added a real root-scoped service-worker registration helper, injected into all 15 public entry routes by the Cloudflare build.
- Fixed the missing `manifest.webmanifest` deployment asset and added a manifest link to each public entry route at build time.
- Updated the cache from v13 to v14 and included the registration helper in the required precache set.
- CI now checks that every required `CORE_ASSETS` entry exists in `dist`; this prevents an incomplete `cache.addAll` from breaking worker installation.
- Privacy page now describes the registration and browser-local static cache accurately.
- Main commit: `a15683ba4c973ca6ce347f5c6ee0f441295b1697`; quality `46165602113` and Cloudflare production smoke `46165602068` both passed.
- OpenSEO final crawl `e7d27014-9852-4876-befa-a76885cb1aec`: 15/15 pages HTTP 200, one H1 each, zero missing alt, zero crawl issues. OpenSEO domain setting is now correct.
- Browser navigation was blocked in the automation environment, so the actual first-time installation and offline click-through remain unverified. Founder needs to open/refresh once online and test a cached route in airplane mode.
- Still not operational: D1 database binding, Amazon Creators API, Google Search Console property (connected account shows zero properties), live inventory, bookings, payments or synced accounts.


# Public catalogue API readiness guard — 28 November 2026

- The public /api/products handler now returns an explicit HTTP 503 setup response when curated products need refreshing but Amazon Creators API credentials are not configured.
- Valid, unexpired cached catalogue records can still be returned without a live Amazon refresh.
- Regression checks cover missing D1, missing Amazon credentials, and the valid-cache path using a mocked database.
- This does not activate D1, Amazon Creators API, product inventory, or affiliate commerce. Those remain approval/configuration gates.


## Product API production smoke contract — 28 November 2026

- Cloudflare deployment smoke tests now call `/api/products` and validate either a valid catalogue response or the explicit 503 setup state.
- The expected setup message is cross-checked against API health so missing D1 and missing Amazon credentials are not confused.
- Repository checks ensure the production assertion remains present.
- This does not configure D1, Amazon Creators API or live product inventory.

# PWA API cache isolation — 28 November 2026

- Review found the v14 Service Worker intercepted all same-origin GET requests, including API requests and the authenticated admin catalogue GET route. The previous manual Cache Storage write did not enforce HTTP no-store or private directives.
- Updated the worker to v15. It bypasses /api and /api/*, requests carrying Authorization, and requests marked cache: no-store.
- Responses marked Cache-Control: no-store, Cache-Control: private, or Vary: * are not stored. Public pages and static assets remain cacheable for offline use.
- Activating v15 clears the previous v14 cache using the existing cache cleanup logic.
- Automated handler tests exercise API/admin bypass, authenticated and no-store request bypass, public asset caching, and private response exclusion.
- Production smoke checks verify the deployed v15 worker contains the API and Authorization exclusions.
- This is browser cache isolation, not server-side auth or access control. Actual device-level PWA/offline behavior remains a separate test.

# PWA v15 release closeout — 28 November 2026

- PR #11 merged the Service Worker API/private-cache isolation as commit 59c799425f9d53fc5251fddf0cb98cb1e952bbc3.
- The first production smoke run uploaded v15 but failed because the new worker assertions ran before /sw.js had been downloaded. PR #12 corrected the assertion order and added a regression check; the workflow now enforces download-before-inspection.
- Latest main commit: f7b2f03a2125b76e6aca99f913c547469b9b3aa2.
- Quality run 46171814518 passed. Final Cloudflare deploy and full production smoke run 46171814555 passed.
- Live log confirms Service Worker v15 and its API/auth exclusions. API health is ok; D1 and Amazon Creators API remain unconfigured. The public product API reports its expected explicit missing-D1 setup response.
- Do not treat CI's static/deployment smoke as proof that a visitor's browser has installed the worker or can navigate offline. Founder-device PWA/offline verification is still required.


# Visitor journey QA and India domestic strategy — 28 November 2026

- Read `docs/VISITOR-JOURNEY-QA-AND-ACTIVATION.md` for the evidence boundary, route QA matrix, current device-level acceptance checklist, Search Console activation gate and backend activation gates.
- The real interactive browser agent did not start in the 28 Nov pass because the connected browser-testing wallet was negative USD 0.072. No top-up was made. Do not claim real Android, desktop screenshot, console or airplane-mode QA is complete.
- The code/source review found five stale links to the retired `/#planner` section in Travel, Budget Planner, Privacy, Terms and Safety. A corrective PR updates those calls-to-action to `/experiences/#plannerForm` and adds a cross-page fragment regression check.
- Read `docs/INDIA-TO-INDIA-EXPERIENCE-STRATEGY.md` for the proposed VELORA India Edit: a domestic travel journey inside VELORA Travel, not a separate brand/site. It connects destination choice, reasons to visit, verified stay/review evidence, budget assumptions, local culture/shopping, style and all eight departments.
- The domestic travel idea is a research hypothesis, not a live feature or booking service. Start with 3–5 rigorously sourced pilot routes only after evidence and user validation. Wedding Season Edit is an editorial use case, not supplier inventory.
- Market evidence reviewed includes Ministry of Tourism's 2025 domestic visit data (noting Kumbh Mela effect), the 27 Sep 2026 Dekho Apna Desh 2.0 / National Digital Tourism Stack announcement, competitor product pages and June 2026 wedding travel coverage. Strategy source URLs and limitations are in the India strategy document.
- Search Console still has no verified property in the connected account. D1 and Amazon Creators API remain unconfigured. Follow activation steps only after the founder completes required account-level approval and setup.
