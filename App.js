import React, { useState } from 'react';
import {
  View, Text, Pressable, ScrollView, TextInput, StatusBar, Platform, SafeAreaView,
} from 'react-native';
import Svg, { Rect, Path, Circle, Text as SvgText } from 'react-native-svg';

// ---------------- THEME ----------------
const C = {
  bg: '#F4F6F8', ink: '#0F1B2D', mute: '#4A5668', line: '#D5DCE4', white: '#fff',
  accent: '#0E7C66', accentDark: '#0B6652', tint: '#E3F3EE', track: '#DDE3EA',
};

// ---------------- DATA ----------------
const CATS = ['Cafés', 'Restaurants', 'Bars and pubs', 'Bakeries', 'Bookstores', 'Parks and outdoors',
  'Gyms and studios', 'Coworking spaces', 'Cinemas and theaters', 'Local shops'];

const QUESTIONS = [
  { id: 'budget', multi: false, title: "What's your usual budget?", hint: 'Per person, per visit.', options: [
    { id: 'b1', label: '$ Budget-friendly', desc: 'I like to keep it cheap' },
    { id: 'b2', label: '$$ Moderate', desc: 'Fair prices are fine' },
    { id: 'b3', label: '$$$ Treat myself', desc: 'Quality matters more than price' },
    { id: 'b4', label: 'It depends', desc: 'Depends on the occasion' }] },
  { id: 'vibe', multi: true, title: 'What atmosphere do you enjoy?', hint: 'Select all that apply.', options: [
    { id: 'v1', label: 'Quiet and calm' }, { id: 'v2', label: 'Lively and social' }, { id: 'v3', label: 'Cozy and warm' },
    { id: 'v4', label: 'Modern and trendy' }, { id: 'v5', label: 'Outdoors and fresh air' }, { id: 'v6', label: 'Local hidden gems' }] },
  { id: 'company', multi: false, title: 'Who do you usually go with?', hint: 'This helps us judge group size and noise level.', options: [
    { id: 'c1', label: 'Just me' }, { id: 'c2', label: 'With a partner' }, { id: 'c3', label: 'With friends' },
    { id: 'c4', label: 'With family or kids' }, { id: 'c5', label: 'With coworkers' }] },
  { id: 'musts', multi: true, title: 'Any must-haves?', hint: 'We will only show places that offer these.', options: [
    { id: 'm1', label: 'Free Wi-Fi' }, { id: 'm2', label: 'Outdoor seating' }, { id: 'm3', label: 'Pet-friendly' },
    { id: 'm4', label: 'Vegan or vegetarian options' }, { id: 'm5', label: 'Wheelchair accessible' }, { id: 'm6', label: 'Open late' }] },
  { id: 'priority', multi: false, title: 'What matters most when you choose a place?', hint: 'Pick the one that decides it for you.', options: [
    { id: 'p1', label: 'Top ratings', desc: 'Other people loved it' },
    { id: 'p2', label: 'Low prices', desc: 'Good value for money' },
    { id: 'p3', label: 'Short distance', desc: 'Close to where I am' },
    { id: 'p4', label: 'The right atmosphere', desc: 'It has to feel right' }] },
  { id: 'novelty', multi: false, title: 'How adventurous are you feeling?', hint: 'We can balance favorites and new discoveries.', options: [
    { id: 'n1', label: 'Stick to what I know', desc: 'Show me familiar types of places' },
    { id: 'n2', label: 'A mix of familiar and new' },
    { id: 'n3', label: 'Surprise me', desc: 'I want to discover something different' }] },
];

const AREAS = ['Downtown', 'Old Town', 'University campus', 'Harbor district'];
const RADII = ['500 m', '1 km', '3 km', '5 km'];

// SAMPLE DATA (fake, for the mockup only)
const PLACES = [
  { name: 'Linden Coffee Lab', type: 'Café', dist: '0.3 km', price: '$$', pct: 94, hours: 'Open until 8:00 PM',
    why: 'Quiet, free Wi-Fi and right in your budget.',
    rows: [['Budget fit', 100], ['Atmosphere', 92], ['Must-haves', 95], ['Distance', 96], ['Your top priority', 88]] },
  { name: 'Casa Olive', type: 'Restaurant', dist: '0.6 km', price: '$$', pct: 89, hours: 'Open until 10:30 PM',
    why: 'Cozy room with vegan options, great with friends.',
    rows: [['Budget fit', 90], ['Atmosphere', 94], ['Must-haves', 88], ['Distance', 85], ['Your top priority', 87]] },
  { name: 'The Reading Room', type: 'Bookstore and café', dist: '0.9 km', price: '$', pct: 86, hours: 'Open until 9:00 PM',
    why: 'Calm, budget-friendly and a place you may not know yet.',
    rows: [['Budget fit', 100], ['Atmosphere', 84], ['Must-haves', 80], ['Distance', 78], ['Your top priority', 90]] },
  { name: 'Harbor Social', type: 'Bar', dist: '1.2 km', price: '$$$', pct: 78, hours: 'Open until 1:00 AM',
    why: 'Lively and open late, but above your usual budget.',
    rows: [['Budget fit', 55], ['Atmosphere', 88], ['Must-haves', 82], ['Distance', 70], ['Your top priority', 85]] },
];

// ---------------- SMALL PIECES ----------------
const Pin = ({ x, y, n, dark }) => (
  <>
    <Circle cx={x} cy={y} r={15} fill={dark ? C.ink : C.accent} />
    <SvgText x={x} y={y + 5} fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">{n}</SvgText>
  </>
);

const MapArt = ({ variant }) => {
  if (variant === 'location') {
    return (
      <Svg viewBox="0 0 342 130" style={{ width: '100%', aspectRatio: 342 / 130, borderRadius: 16 }}>
        <Rect width="342" height="130" fill="#DCE8E3" />
        <Rect x="210" y="14" width="96" height="48" rx="10" fill="#C3DEC9" />
        <Path d="M0 50 H342 M0 96 H342 M90 0 V130 M170 0 V130 M250 0 V130" stroke="#fff" strokeWidth="7" fill="none" />
        <Circle cx="170" cy="65" r="46" fill="#0E7C66" fillOpacity="0.14" stroke="#0E7C66" strokeWidth="2" strokeDasharray="5 4" />
        <Circle cx="170" cy="65" r="9" fill="#0E7C66" stroke="#fff" strokeWidth="3" />
      </Svg>
    );
  }
  const h = variant === 'welcome' ? 190 : 170;
  return (
    <Svg viewBox={`0 0 342 ${h}`} style={{ width: '100%', aspectRatio: 342 / h, borderRadius: 20 }}>
      <Rect width="342" height={h} fill="#DCE8E3" />
      <Path d={`M0 ${h - 40} C80 ${h - 60} 120 ${h - 10} 200 ${h - 30} S320 ${h - 60} 342 ${h - 50} L342 ${h} L0 ${h}Z`} fill="#BFD8EA" />
      <Rect x="22" y="18" width="90" height="54" rx="10" fill="#C3DEC9" />
      <Path d={`M0 ${h * 0.4} H342 M0 ${h * 0.6} H342 M80 0 V${h} M190 0 V${h} M270 0 V${h}`} stroke="#fff" strokeWidth="7" fill="none" />
      <Pin x={80} y={h * 0.3} n={94} />
      <Pin x={190} y={h * 0.5} n={89} />
      <Pin x={270} y={h * 0.22} n={86} />
      <Pin x={236} y={h * 0.73} n={78} dark />
    </Svg>
  );
};

const Btn = ({ label, onPress, disabled, style }) => (
  <Pressable
    onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityState={{ disabled: !!disabled }}
    style={[{ height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center',
      backgroundColor: disabled ? C.track : C.accent }, style]}>
    <Text style={{ fontSize: 16, fontWeight: '700', color: disabled ? '#5B6677' : '#fff' }}>{label}</Text>
  </Pressable>
);

const BackBtn = ({ onPress, label }) => (
  <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label || 'Go back'}
    style={{ width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: C.line, backgroundColor: '#fff',
      alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ fontSize: 22, color: C.ink, marginTop: -2 }}>‹</Text>
  </Pressable>
);

const Footer = ({ children, row }) => (
  <View style={{ paddingHorizontal: 24, paddingTop: 14, paddingBottom: 24, backgroundColor: C.bg, borderTopWidth: 1,
    borderTopColor: '#E1E6EC', flexDirection: row ? 'row' : 'column', alignItems: row ? 'center' : 'stretch', gap: row ? 12 : 10 }}>
    {children}
  </View>
);

const H2 = ({ children }) => (
  <Text style={{ fontSize: 26, lineHeight: 30, fontWeight: '800', color: C.ink, letterSpacing: -0.4 }}>{children}</Text>
);
const Sub = ({ children }) => (
  <Text style={{ fontSize: 14, lineHeight: 20, color: C.mute, marginTop: 6 }}>{children}</Text>
);

const Check = () => (
  <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ color: '#fff', fontSize: 13, fontWeight: '800' }}>✓</Text>
  </View>
);

// ---------------- APP ----------------
export default function App() {
  const [screen, setScreen] = useState('welcome');
  const [cats, setCats] = useState({});
  const [q, setQ] = useState(0);
  const [ans, setAns] = useState({});
  const [loc, setLoc] = useState('');
  const [radius, setRadius] = useState('1 km');
  const [place, setPlace] = useState(0);
  const [saved, setSaved] = useState({});

  const catCount = Object.keys(cats).length;
  const quest = QUESTIONS[q];

  const goBack = () => {
    if (screen === 'categories') setScreen('welcome');
    else if (screen === 'questions') { if (q > 0) setQ(q - 1); else setScreen('categories'); }
    else if (screen === 'location') { setQ(QUESTIONS.length - 1); setScreen('questions'); }
    else if (screen === 'results') setScreen('location');
    else if (screen === 'detail') setScreen('results');
  };
  const nextQ = () => { if (q < QUESTIONS.length - 1) setQ(q + 1); else setScreen('location'); };
  const toggleCat = (c) => { const n = { ...cats }; if (n[c]) delete n[c]; else n[c] = true; setCats(n); };
  const pickOpt = (id) => {
    if (quest.multi) {
      const cur = ans[quest.id] ? [...ans[quest.id]] : [];
      const i = cur.indexOf(id);
      if (i > -1) cur.splice(i, 1); else cur.push(id);
      setAns({ ...ans, [quest.id]: cur });
    } else {
      setAns({ ...ans, [quest.id]: id });
    }
  };
  const answered = quest.multi ? (ans[quest.id] || []).length > 0 : !!ans[quest.id];

  const Header = () => {
    const idx = screen === 'categories' ? 1 : screen === 'questions' ? q + 2 : 8;
    const label = screen === 'categories' ? 'STEP 1 OF 3 · PLACES' : screen === 'questions' ? 'STEP 2 OF 3 · ABOUT YOU' : 'STEP 3 OF 3 · LOCATION';
    return (
      <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <BackBtn onPress={goBack} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: C.mute, letterSpacing: 0.5, marginBottom: 8 }}>{label}</Text>
          <View style={{ height: 6, borderRadius: 3, backgroundColor: C.track, overflow: 'hidden' }}>
            <View style={{ height: 6, borderRadius: 3, backgroundColor: C.accent, width: `${Math.round((idx / 8) * 100)}%` }} />
          </View>
        </View>
      </View>
    );
  };

  let body = null;

  // ---- WELCOME ----
  if (screen === 'welcome') {
    body = (
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 28, gap: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 14, height: 14, borderRadius: 7, borderWidth: 3, borderColor: '#fff' }} />
          </View>
          <Text style={{ fontSize: 20, fontWeight: '800', color: C.ink }}>Matchspot</Text>
        </View>
        <MapArt variant="welcome" />
        <View style={{ gap: 10 }}>
          <Text style={{ fontSize: 30, lineHeight: 34, fontWeight: '800', color: C.ink, letterSpacing: -0.5 }}>
            Find places that fit you, not just places nearby.
          </Text>
          <Text style={{ fontSize: 15, lineHeight: 22, color: C.mute }}>
            Tell us what you like once. Matchspot scores every spot around you against your taste.
          </Text>
        </View>
        <View style={{ gap: 10 }}>
          {['Pick the kinds of places you want', 'Answer a few quick questions about you', 'Choose a location and see your best matches'].map((t, i) => (
            <View key={t} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: C.tint, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 13, fontWeight: '800', color: C.accentDark }}>{i + 1}</Text>
              </View>
              <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink, flex: 1 }}>{t}</Text>
            </View>
          ))}
        </View>
        <View style={{ alignItems: 'center', gap: 10, marginTop: 4 }}>
          <Btn label="Get started" onPress={() => setScreen('categories')} style={{ alignSelf: 'stretch' }} />
          <Text style={{ fontSize: 12, color: C.mute }}>Takes about 2 minutes</Text>
        </View>
      </ScrollView>
    );
  }

  // ---- CATEGORIES ----
  if (screen === 'categories') {
    body = (
      <View style={{ flex: 1 }}>
        <Header />
        <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 12 }}>
          <H2>What kind of places are you looking for?</H2>
          <Sub>Pick one or more. You can change this anytime.</Sub>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 18 }}>
            {CATS.map((c) => {
              const on = !!cats[c];
              return (
                <Pressable key={c} onPress={() => toggleCat(c)} accessibilityRole="button" accessibilityState={{ selected: on }}
                  style={{ width: '47.5%', minHeight: 64, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 16, borderWidth: 2,
                    borderColor: on ? C.accent : C.line, backgroundColor: on ? C.tint : '#fff',
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: C.ink, flex: 1 }}>{c}</Text>
                  {on ? <Check /> : null}
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
        <Footer>
          <Text style={{ textAlign: 'center', fontSize: 13, fontWeight: '600', color: C.mute }}>
            {catCount === 0 ? 'Select at least one to continue' : `${catCount} selected`}
          </Text>
          <Btn label="Continue" disabled={catCount === 0} onPress={() => { setQ(0); setScreen('questions'); }} />
        </Footer>
      </View>
    );
  }

  // ---- QUESTIONS ----
  if (screen === 'questions') {
    const sel = ans[quest.id];
    body = (
      <View style={{ flex: 1 }}>
        <Header />
        <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 12 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: C.accentDark, marginBottom: 8 }}>Question {q + 1} of {QUESTIONS.length}</Text>
          <H2>{quest.title}</H2>
          <Sub>{quest.hint}</Sub>
          <View style={{ gap: 10, marginTop: 18 }}>
            {quest.options.map((o) => {
              const on = quest.multi ? (sel || []).includes(o.id) : sel === o.id;
              return (
                <Pressable key={o.id} onPress={() => pickOpt(o.id)} accessibilityRole={quest.multi ? 'checkbox' : 'radio'}
                  accessibilityState={{ checked: on }}
                  style={{ minHeight: 58, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 16, borderWidth: 2,
                    borderColor: on ? C.accent : C.line, backgroundColor: on ? C.tint : '#fff',
                    flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  <View style={{ width: 22, height: 22, borderRadius: quest.multi ? 6 : 11, borderWidth: 2,
                    borderColor: on ? C.accent : '#8A95A5', backgroundColor: on ? C.accent : '#fff',
                    alignItems: 'center', justifyContent: 'center' }}>
                    {on ? <Text style={{ color: '#fff', fontSize: 12, fontWeight: '800' }}>✓</Text> : null}
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: C.ink }}>{o.label}</Text>
                    {o.desc ? <Text style={{ fontSize: 13, color: C.mute }}>{o.desc}</Text> : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
        <Footer row>
          <Pressable onPress={nextQ} style={{ height: 56, paddingHorizontal: 18, justifyContent: 'center' }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: C.mute }}>Skip</Text>
          </Pressable>
          <Btn label={q === QUESTIONS.length - 1 ? 'Continue' : 'Next'} disabled={!answered} onPress={nextQ} style={{ flex: 1 }} />
        </Footer>
      </View>
    );
  }

  // ---- LOCATION ----
  if (screen === 'location') {
    body = (
      <View style={{ flex: 1 }}>
        <Header />
        <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 12, gap: 16 }} keyboardShouldPersistTaps="handled">
          <View>
            <H2>Where do you want to go?</H2>
            <Sub>Enter a target area. We will look for your best matches around it.</Sub>
          </View>
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: C.mute }}>Target location</Text>
            <View style={{ height: 56, borderRadius: 16, backgroundColor: '#fff', borderWidth: 2, borderColor: C.line,
              paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text style={{ fontSize: 16, color: C.mute }}>⌕</Text>
              <TextInput value={loc} onChangeText={setLoc} placeholder="Neighborhood, address or city"
                placeholderTextColor="#6B7686" accessibilityLabel="Target location"
                style={{ flex: 1, fontSize: 16, fontWeight: '600', color: C.ink }} />
            </View>
          </View>
          <Pressable onPress={() => setLoc('Current location')} accessibilityRole="button"
            style={{ height: 48, borderRadius: 14, borderWidth: 2, borderColor: C.accent, backgroundColor: '#fff',
              alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: C.accentDark }}>Use my current location</Text>
          </Pressable>
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: C.mute }}>Popular areas</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {AREAS.map((a) => {
                const on = loc === a;
                return (
                  <Pressable key={a} onPress={() => setLoc(a)} accessibilityRole="button" accessibilityState={{ selected: on }}
                    style={{ height: 40, paddingHorizontal: 16, borderRadius: 20, borderWidth: 2, justifyContent: 'center',
                      borderColor: on ? C.accent : C.line, backgroundColor: on ? C.tint : '#fff' }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink }}>{a}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: C.mute }}>Search radius</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {RADII.map((r) => {
                const on = radius === r;
                return (
                  <Pressable key={r} onPress={() => setRadius(r)} accessibilityRole="button" accessibilityState={{ selected: on }}
                    style={{ flex: 1, height: 44, borderRadius: 14, borderWidth: 2, alignItems: 'center', justifyContent: 'center',
                      borderColor: on ? C.accent : C.line, backgroundColor: on ? C.tint : '#fff' }}>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: C.ink }}>{r}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
          <MapArt variant="location" />
        </ScrollView>
        <Footer>
          <Btn label="Show my matches" disabled={!loc.trim()} onPress={() => setScreen('results')} />
        </Footer>
      </View>
    );
  }

  // ---- RESULTS ----
  if (screen === 'results') {
    body = (
      <View style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <BackBtn onPress={goBack} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: C.mute, letterSpacing: 0.5 }}>YOUR MATCHES NEAR</Text>
            <Text numberOfLines={1} style={{ fontSize: 17, fontWeight: '800', color: C.ink }}>{(loc || 'Current location') + ' · ' + radius}</Text>
          </View>
          <Pressable onPress={() => setScreen('categories')} accessibilityRole="button"
            style={{ height: 44, paddingHorizontal: 16, borderRadius: 22, borderWidth: 1, borderColor: C.line, backgroundColor: '#fff', justifyContent: 'center' }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink }}>Edit</Text>
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 4, paddingBottom: 32, gap: 16 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {Object.keys(cats).map((c) => (
              <View key={c} style={{ height: 32, paddingHorizontal: 14, borderRadius: 16, backgroundColor: C.tint, justifyContent: 'center' }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: C.accentDark }}>{c}</Text>
              </View>
            ))}
          </View>
          <MapArt variant="results" />
          <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: C.ink }}>Top matches for you</Text>
            <Text style={{ fontSize: 12, fontWeight: '600', color: C.mute }}>Sample data</Text>
          </View>
          <View style={{ gap: 12 }}>
            {PLACES.map((p, i) => (
              <Pressable key={p.name} onPress={() => { setPlace(i); setScreen('detail'); }} accessibilityRole="button"
                style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 18, padding: 16,
                  flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 18, fontWeight: '800', color: '#fff' }}>{p.pct}%</Text>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff', letterSpacing: 0.5 }}>MATCH</Text>
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={{ fontSize: 16, fontWeight: '800', color: C.ink }}>{p.name}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: C.mute }}>{p.type} · {p.dist} · {p.price}</Text>
                  <Text style={{ fontSize: 13, lineHeight: 18, color: '#2B3748' }}>{p.why}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  // ---- DETAIL ----
  if (screen === 'detail') {
    const p = PLACES[place];
    const isSaved = !!saved[place];
    body = (
      <View style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <BackBtn onPress={goBack} label="Back to matches" />
          <Text style={{ fontSize: 14, fontWeight: '700', color: C.mute }}>Place details</Text>
        </View>
        <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 4, gap: 18 }}>
          <Svg viewBox="0 0 342 130" style={{ width: '100%', aspectRatio: 342 / 130, borderRadius: 20 }}>
            <Rect width="342" height="130" fill="#CFE6DF" />
            <Rect x="40" y="30" width="262" height="24" fill="#0E7C66" />
            <Path d="M40 30h37v24H40zM114 30h37v24h-37zM188 30h37v24h-37zM262 30h40v24h-40z" fill="#fff" fillOpacity="0.85" />
            <Rect x="56" y="54" width="230" height="76" fill="#F4F6F8" />
            <Rect x="76" y="76" width="56" height="54" fill="#0F1B2D" />
            <Rect x="156" y="72" width="110" height="38" rx="4" fill="#CFE6DF" />
          </Svg>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={{ fontSize: 24, lineHeight: 28, fontWeight: '800', color: C.ink }}>{p.name}</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: C.mute }}>{p.type} · {p.dist} away · {p.price}</Text>
              <Text style={{ fontSize: 13, fontWeight: '700', color: C.accentDark }}>{p.hours}</Text>
            </View>
            <View style={{ width: 84, height: 84 }}>
              <Svg width={84} height={84} viewBox="0 0 84 84" accessibilityLabel={`Match score ${p.pct} percent`}>
                <Circle cx="42" cy="42" r="34" fill="none" stroke={C.track} strokeWidth="8" />
                <Circle cx="42" cy="42" r="34" fill="none" stroke={C.accent} strokeWidth="8" strokeLinecap="round"
                  strokeDasharray="213.6" strokeDashoffset={213.6 * (1 - p.pct / 100)} rotation={-90} origin="42, 42" />
              </Svg>
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: '800', color: C.ink }}>{p.pct}%</Text>
                <Text style={{ fontSize: 10, fontWeight: '700', color: C.mute, letterSpacing: 0.5 }}>MATCH</Text>
              </View>
            </View>
          </View>
          <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 18, padding: 16, gap: 14 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: C.ink }}>Why it matches you</Text>
            {p.rows.map(([label, pct]) => (
              <View key={label} style={{ gap: 6 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: C.ink }}>{label}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: C.accentDark }}>{pct}%</Text>
                </View>
                <View style={{ height: 8, borderRadius: 4, backgroundColor: C.track, overflow: 'hidden' }}>
                  <View style={{ height: 8, borderRadius: 4, backgroundColor: C.accent, width: `${pct}%` }} />
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
        <Footer row>
          <Pressable onPress={() => setSaved({ ...saved, [place]: !isSaved })} accessibilityRole="button"
            accessibilityState={{ selected: isSaved }}
            style={{ width: 116, height: 56, borderRadius: 16, borderWidth: 2, alignItems: 'center', justifyContent: 'center',
              borderColor: isSaved ? C.accent : C.line, backgroundColor: isSaved ? C.tint : '#fff' }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: C.ink }}>{isSaved ? 'Saved' : 'Save'}</Text>
          </Pressable>
          <Btn label="Get directions" onPress={() => {}} style={{ flex: 1 }} />
        </Footer>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      {body}
    </SafeAreaView>
  );
}
