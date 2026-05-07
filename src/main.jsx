import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Award,
  CalendarDays,
  Crown,
  LogIn,
  LogOut,
  PackageOpen,
  Repeat2,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Users,
  UserRound,
} from 'lucide-react';
import './styles.css';
import { computeAchievementProgress } from './data/achievements';
import {
  albumCards,
  emptyProgress,
  getTimeUntilNextReset,
  rarityConfig,
  teams,
} from './data/albumData';
import { syncAchievements } from './lib/achievementStore';
import { loadLocalProgress, openLocalPack, saveLocalProgress } from './lib/localStore';
import { hasSupabaseEnv, supabase } from './lib/supabase';
import {
  createTradeOffer,
  ensureProfile,
  loadCloudProgress,
  loadTrades,
  openCloudPack,
  respondToTradeOffer,
  searchProfiles,
} from './lib/cloudStore';

const photoCache = new Map();
const summaryCache = new Map();

function App() {
  const [progress, setProgress] = useState(emptyProgress);
  const [selectedTeam, setSelectedTeam] = useState('TODOS');
  const [view, setView] = useState('album');
  const [session, setSession] = useState(null);
  const [authForm, setAuthForm] = useState({ email: '', password: '', displayName: '' });
  const [authMode, setAuthMode] = useState('signin');
  const [authMessage, setAuthMessage] = useState('');
  const [appError, setAppError] = useState('');
  const [busy, setBusy] = useState(true);
  const [tradeFeed, setTradeFeed] = useState([]);
  const [directory, setDirectory] = useState([]);
  const [focusedCard, setFocusedCard] = useState(null);
  const [tradeForm, setTradeForm] = useState({
    targetUserId: '',
    search: '',
    offeredStickerId: '',
    requestedStickerId: '',
    note: '',
  });

  const isCloudMode = Boolean(hasSupabaseEnv);
  const achievements = useMemo(() => computeAchievementProgress(progress), [progress]);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      try {
        if (!isCloudMode) {
          if (active) {
            setProgress(loadLocalProgress());
            setBusy(false);
          }
          return;
        }

        const [{ data: sessionData }, authSubscription] = await Promise.all([
          supabase.auth.getSession(),
          Promise.resolve(
            supabase.auth.onAuthStateChange((_event, nextSession) => {
              if (!active) return;
              setSession(nextSession);
            })
          ),
        ]);

        if (!active) return;
        setSession(sessionData.session);
        setBusy(false);

        const { data: listener } = authSubscription;
        return () => listener.subscription.unsubscribe();
      } catch (error) {
        if (active) {
          setAppError(error.message || 'No pude iniciar la app.');
          setBusy(false);
        }
      }
    }

    let cleanup;
    bootstrap().then((result) => {
      cleanup = result;
    });

    return () => {
      active = false;
      if (cleanup) cleanup();
    };
  }, [isCloudMode]);

  useEffect(() => {
    let active = true;

    async function syncProgress() {
      if (!isCloudMode) return;
      if (!session?.user) {
        if (active) {
          setProgress(emptyProgress());
          setTradeFeed([]);
        }
        return;
      }

      try {
        setBusy(true);
        await ensureProfile(supabase, session.user);
        const [cloudProgress, trades] = await Promise.all([
          loadCloudProgress(supabase, session.user),
          loadTrades(supabase, session.user),
        ]);
        if (!active) return;
        setProgress(cloudProgress);
        setTradeFeed(trades);
        setAppError('');
      } catch (error) {
        if (active) setAppError(error.message || 'No pude sincronizar la cuenta.');
      } finally {
        if (active) setBusy(false);
      }
    }

    syncProgress();

    return () => {
      active = false;
    };
  }, [isCloudMode, session]);

  useEffect(() => {
    let active = true;

    async function fetchDirectory() {
      if (!isCloudMode || !session?.user) return;
      try {
        const results = await searchProfiles(supabase, tradeForm.search);
        if (active) setDirectory(results);
      } catch (error) {
        if (active) setAppError(error.message || 'No pude buscar amigos.');
      }
    }

    fetchDirectory();
    return () => {
      active = false;
    };
  }, [isCloudMode, session, tradeForm.search]);

  useEffect(() => {
    if (isCloudMode) return;
    saveLocalProgress(progress);
  }, [isCloudMode, progress]);

  useEffect(() => {
    async function persistAchievements() {
      if (!isCloudMode || !session?.user) return;
      try {
        await syncAchievements(supabase, session.user.id, progress);
      } catch (error) {
        setAppError(error.message || 'No pude sincronizar los logros.');
      }
    }

    persistAchievements();
  }, [achievements, isCloudMode, progress, session]);

  useEffect(() => {
    if (!focusedCard) return undefined;

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setFocusedCard(null);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedCard]);

  const stats = useMemo(() => {
    const unique = Object.values(progress.owned).filter((count) => count > 0).length;
    const repeated = Object.values(progress.owned).reduce((sum, count) => sum + Math.max(0, count - 1), 0);
    const completion = Math.round((unique / albumCards.length) * 100);
    const coaches = albumCards.filter((card) => card.role === 'coach' && (progress.owned[card.id] || 0) > 0).length;
    return { unique, repeated, completion, coaches };
  }, [progress.owned]);

  const filteredCards =
    selectedTeam === 'TODOS' ? albumCards : albumCards.filter((card) => card.code === selectedTeam);
  const repeatedCards = albumCards.filter((card) => (progress.owned[card.id] || 0) > 1);
  const packsLeft = Math.max(0, 7 - progress.packsOpenedThisWeek);
  const countdownText = getTimeUntilNextReset();
  const selectedTeamData = teams.find((team) => team.code === selectedTeam) || null;
  const ownedCards = albumCards.filter((card) => (progress.owned[card.id] || 0) > 0);

  async function refreshCloudState() {
    if (!isCloudMode || !session?.user) return;
    const [cloudProgress, trades] = await Promise.all([
      loadCloudProgress(supabase, session.user),
      loadTrades(supabase, session.user),
    ]);
    setProgress(cloudProgress);
    setTradeFeed(trades);
  }

  async function handleAuthSubmit(event) {
    event.preventDefault();
    if (!supabase) return;

    try {
      setBusy(true);
      setAuthMessage('');
      setAppError('');

      if (authMode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email: authForm.email,
          password: authForm.password,
          options: { data: { display_name: authForm.displayName } },
        });
        if (error) throw error;
        setAuthMessage('Cuenta creada. Si tu proyecto exige confirmacion por email, revisa tu casilla.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: authForm.email,
          password: authForm.password,
        });
        if (error) throw error;
      }
    } catch (error) {
      setAppError(error.message || 'No pude autenticar la cuenta.');
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setTradeFeed([]);
  }

  async function handleOpenPack() {
    try {
      setBusy(true);
      setAppError('');
      const next = isCloudMode && session?.user ? await openCloudPack(supabase) : openLocalPack(progress);
      setProgress(next);
      if (isCloudMode && session?.user) {
        const trades = await loadTrades(supabase, session.user);
        setTradeFeed(trades);
      }
      setView('sobre');
    } catch (error) {
      setAppError(error.message || 'No pude abrir el sobre.');
    } finally {
      setBusy(false);
    }
  }

  function handleResetDemo() {
    if (isCloudMode) return;
    setProgress(emptyProgress());
    setView('album');
    setSelectedTeam('TODOS');
    setAppError('');
  }

  async function handleCreateTrade(event) {
    event.preventDefault();
    if (!supabase || !session?.user) return;

    try {
      setBusy(true);
      setAppError('');
      await createTradeOffer(supabase, {
        targetUserId: tradeForm.targetUserId,
        offeredStickerId: Number(tradeForm.offeredStickerId),
        requestedStickerId: Number(tradeForm.requestedStickerId),
        note: tradeForm.note,
      });
      setTradeForm({ targetUserId: '', search: '', offeredStickerId: '', requestedStickerId: '', note: '' });
      await refreshCloudState();
    } catch (error) {
      setAppError(error.message || 'No pude crear el intercambio.');
    } finally {
      setBusy(false);
    }
  }

  async function handleTradeResponse(tradeId, nextStatus) {
    if (!supabase || !session?.user) return;

    try {
      setBusy(true);
      setAppError('');
      await respondToTradeOffer(supabase, tradeId, nextStatus);
      await refreshCloudState();
    } catch (error) {
      setAppError(error.message || 'No pude actualizar el intercambio.');
    } finally {
      setBusy(false);
    }
  }

  if (busy && !progress.weekKey) {
    return <div className="loading-screen">Cargando album...</div>;
  }

  return (
    <div className="app-shell">
      <div className="album-ribbon album-ribbon-left" />
      <div className="album-ribbon album-ribbon-right" />

      <header className="hero">
        <div className="hero-badge">Sticker Collection Â· Edicion entre amigos</div>
        <h1>Album Mundial 2026</h1>
        <h2 className="hero-tagline">La coleccion que se vive sobre a sobre.</h2>
        <p className="subtitle">
          Ahora la app puede vivir en dos modos: demo local para pruebas rapidas, o nube real con
          Supabase para cuentas, progreso compartido, inventario persistente y base para intercambios.
        </p>
        <div className="hero-highlights">
          <Highlight icon={<Users size={18} />} text="26 jugadores + DT por pais" />
          <Highlight icon={<PackageOpen size={18} />} text="324 figuritas en total" />
          <Highlight icon={<Sparkles size={18} />} text={isCloudMode ? 'Modo nube habilitable' : 'Modo demo local activo'} />
        </div>
      </header>

      <section className="stats-grid">
        <StatCard icon={<ShieldCheck size={18} />} label="Progreso" value={`${stats.completion}%`} />
        <StatCard icon={<Star size={18} />} label="Unicas" value={`${stats.unique}/${albumCards.length}`} />
        <StatCard icon={<Repeat2 size={18} />} label="Repetidas" value={String(stats.repeated)} />
        <StatCard icon={<Crown size={18} />} label="DTs" value={`${stats.coaches}/12`} />
      </section>

      <main className="album-page">
        <section className="album-toolbar">
          <div className="album-toolbar-left">
            <span className="toolbar-chip toolbar-chip-primary">Semana {progress.weekKey}</span>
            <span className="toolbar-chip">Reset en {countdownText}</span>
            <span className="toolbar-chip">{packsLeft} sobres disponibles</span>
            <span className="toolbar-chip">{isCloudMode ? (session ? 'Cuenta online' : 'Supabase listo') : 'Modo demo'}</span>
          </div>

          <div className="actions">
            <button className="primary-button" onClick={handleOpenPack} disabled={busy || (isCloudMode && !session)}>
              <Sparkles size={18} />
              Abrir sobre
            </button>
            <select value={selectedTeam} onChange={(event) => setSelectedTeam(event.target.value)}>
              <option value="TODOS">Todas las selecciones</option>
              {teams.map((team) => (
                <option key={team.code} value={team.code}>
                  {team.name}
                </option>
              ))}
            </select>
            {!isCloudMode && (
              <button className="ghost-button" onClick={handleResetDemo}>
                <RotateCcw size={16} />
                Reset demo
              </button>
            )}
            {isCloudMode && session && (
              <button className="ghost-button" onClick={handleSignOut}>
                <LogOut size={16} />
                Salir
              </button>
            )}
          </div>
        </section>

        {isCloudMode && (
          <AuthPanel
            authForm={authForm}
            authMessage={authMessage}
            authMode={authMode}
            busy={busy}
            onChange={setAuthForm}
            onModeChange={setAuthMode}
            onSubmit={handleAuthSubmit}
            session={session}
          />
        )}

        {appError && <div className="error-banner">{appError}</div>}

        <nav className="tabs">
          <TabButton active={view === 'album'} onClick={() => setView('album')}>
            Album
          </TabButton>
          <TabButton active={view === 'sobre'} onClick={() => setView('sobre')}>
            Ultimo sobre
          </TabButton>
          <TabButton active={view === 'repetidas'} onClick={() => setView('repetidas')}>
            Repetidas
          </TabButton>
          <TabButton active={view === 'achievements'} onClick={() => setView('achievements')}>
            Logros
          </TabButton>
          {isCloudMode && session && (
            <TabButton active={view === 'trades'} onClick={() => setView('trades')}>
              Intercambios
            </TabButton>
          )}
        </nav>

        {selectedTeamData && view === 'album' && <TeamOverview team={selectedTeamData} />}

        <section className="feature-band">
          <FeatureCard
            icon={<Trophy size={18} />}
            title="Login y perfiles"
            text="Cada amigo puede entrar con cuenta propia y conservar su album entre dispositivos."
          />
          <FeatureCard
            icon={<CalendarDays size={18} />}
            title="Progreso en la nube"
            text="El inventario pasa a estar en base de datos y deja de depender del navegador local."
          />
          <FeatureCard
            icon={<PackageOpen size={18} />}
            title="Listo para canjes"
            text="Ya queda la base para trade offers y figuritas repetidas reales entre usuarios."
          />
          <FeatureCard
            icon={<Award size={18} />}
            title="Metas visibles"
            text="Ahora el usuario tiene objetivos concretos para seguir entrando y coleccionando."
          />
        </section>

        {view === 'album' && <AlbumGrid cards={filteredCards} owned={progress.owned} onSelectCard={setFocusedCard} />}
        {view === 'sobre' && <PackReveal cards={progress.lastPack} onSelectCard={setFocusedCard} />}
        {view === 'repetidas' && <RepeatedList cards={repeatedCards} owned={progress.owned} onSelectCard={setFocusedCard} />}
        {view === 'achievements' && <AchievementsView achievements={achievements} />}
        {view === 'trades' && isCloudMode && session && (
          <TradesView
            busy={busy}
            currentUserId={session.user.id}
            directory={directory}
            onChangeTradeForm={setTradeForm}
            onCreateTrade={handleCreateTrade}
            onRespond={handleTradeResponse}
            ownedMap={progress.owned}
            repeatedCards={repeatedCards}
            tradeForm={tradeForm}
            trades={tradeFeed}
          />
        )}
        <PlayerModal card={focusedCard} onClose={() => setFocusedCard(null)} />
      </main>
    </div>
  );
}

function AuthPanel({ authForm, authMessage, authMode, busy, onChange, onModeChange, onSubmit, session }) {
  if (session) {
    return (
      <section className="auth-panel">
        <div>
          <span className="section-kicker">Cuenta conectada</span>
          <h2>{session.user.user_metadata?.display_name || session.user.email}</h2>
          <p>{session.user.email}</p>
        </div>
        <div className="auth-status">
          <LogIn size={18} />
          <span>Progreso sincronizado con Supabase</span>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-panel">
      <div>
        <span className="section-kicker">Modo nube</span>
        <h2>Activa cuentas reales para tus amigos</h2>
        <p>Conecta Supabase y cada usuario va a tener login, progreso online e inventario propio.</p>
      </div>

      <form className="auth-form" onSubmit={onSubmit}>
        <div className="auth-mode-switch">
          <button type="button" className={authMode === 'signin' ? 'tab-button active' : 'tab-button'} onClick={() => onModeChange('signin')}>
            Ingresar
          </button>
          <button type="button" className={authMode === 'signup' ? 'tab-button active' : 'tab-button'} onClick={() => onModeChange('signup')}>
            Crear cuenta
          </button>
        </div>

        {authMode === 'signup' && (
          <input
            value={authForm.displayName}
            onChange={(event) => onChange((prev) => ({ ...prev, displayName: event.target.value }))}
            placeholder="Nombre visible"
          />
        )}
        <input
          value={authForm.email}
          onChange={(event) => onChange((prev) => ({ ...prev, email: event.target.value }))}
          placeholder="Email"
          type="email"
        />
        <input
          value={authForm.password}
          onChange={(event) => onChange((prev) => ({ ...prev, password: event.target.value }))}
          placeholder="Contrasena"
          type="password"
        />
        <button className="primary-button" type="submit" disabled={busy}>
          <LogIn size={16} />
          {authMode === 'signup' ? 'Crear cuenta' : 'Ingresar'}
        </button>
        {authMessage && <p className="auth-message">{authMessage}</p>}
      </form>
    </section>
  );
}

function Highlight({ icon, text }) {
  return (
    <div className="highlight">
      {icon}
      <span>{text}</span>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="stat-card">
      <span className="stat-icon">{icon}</span>
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  );
}

function TabButton({ active, children, onClick }) {
  return (
    <button className={active ? 'tab-button active' : 'tab-button'} onClick={onClick}>
      {children}
    </button>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <article className="feature-card">
      <span>{icon}</span>
      <strong>{title}</strong>
      <p>{text}</p>
    </article>
  );
}

function TeamOverview({ team }) {
  const starters = team.starters.map(([name, position]) => ({ name, position }));
  const bench = team.bench.map(([name, position]) => ({ name, position }));
  const lines = [starters.slice(0, 1), starters.slice(1, 5), starters.slice(5, 8), starters.slice(8, 11)];

  return (
    <section className="team-overview">
      <div className="team-overview-copy">
        <span className="section-kicker">{team.name}</span>
        <h2>Formacion probable {team.formation}</h2>
        <p>Vista editorial de la seleccion filtrada: once titular, banco probable y director tecnico.</p>
        <div className="team-overview-meta">
          <span>{team.region}</span>
          <strong>DT: {team.coach}</strong>
        </div>
      </div>

      <div className="pitch-card">
        <div className="pitch">
          {lines.map((group, index) => (
            <div className="pitch-line" key={index}>
              {group.map((player) => (
                <div className="pitch-chip" key={player.name}>
                  <b>{player.position}</b>
                  <span>{player.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="bench-box">
          <h3>Banco probable</h3>
          <div className="bench-grid">
            {bench.map((player) => (
              <div className="bench-chip" key={player.name}>
                <b>{player.position}</b>
                <span>{player.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AlbumGrid({ cards, onSelectCard, owned }) {
  return (
    <section className="sticker-sheet">
      {cards.map((card) => (
        <StickerCard key={card.id} card={card} count={owned[card.id] || 0} onSelect={onSelectCard} />
      ))}
    </section>
  );
}

function PackReveal({ cards, onSelectCard }) {
  if (!cards.length) {
    return <div className="empty-state">Todavia no abriste ningun sobre.</div>;
  }

  return (
    <div className="pack-area">
      <div className="pack-copy">
        <span className="section-kicker">Ultima apertura</span>
        <h2>Sobre revelado</h2>
        <p>Las nuevas quedan marcadas y las repetidas se guardan para canje.</p>
      </div>

      <div className="sticker-sheet reveal-sheet">
        <AnimatePresence>
          {cards.map((card, index) => (
            <motion.div
              key={`${card.id}-${index}-${card.countAfterOpen}`}
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <StickerCard card={card} count={card.countAfterOpen} fresh={card.isNew} onSelect={onSelectCard} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function RepeatedList({ cards, onSelectCard, owned }) {
  if (!cards.length) {
    return <div className="empty-state">Aun no tenes repetidas.</div>;
  }

  return (
    <div className="trade-list">
      {cards.map((card) => (
        <article className="trade-card trade-card-clickable" key={card.id} onClick={() => onSelectCard(card)}>
          <div>
            <p>{card.name}</p>
            <span>
              {card.team} Â· {card.position} Â· {card.role === 'coach' ? 'DT' : card.isStarter ? 'Titular' : 'Banco'}
            </span>
          </div>
          <strong>x{owned[card.id] - 1}</strong>
        </article>
      ))}
    </div>
  );
}

function TradesView({
  busy,
  currentUserId,
  directory,
  onChangeTradeForm,
  onCreateTrade,
  onRespond,
  ownedMap,
  repeatedCards,
  tradeForm,
  trades,
}) {
  return (
    <div className="trades-layout">
      <section className="trade-compose">
        <span className="section-kicker">Nuevo intercambio</span>
        <h2>Proponer canje a un amigo</h2>
        <p>ElegÃ­ una repetida tuya, la figurita que querÃ©s pedir y el usuario destinatario.</p>

        <form className="auth-form" onSubmit={onCreateTrade}>
          <input
            placeholder="Buscar amigo por mail o nombre"
            value={tradeForm.search}
            onChange={(event) => onChangeTradeForm((prev) => ({ ...prev, search: event.target.value }))}
          />

          <select
            value={tradeForm.targetUserId}
            onChange={(event) => onChangeTradeForm((prev) => ({ ...prev, targetUserId: event.target.value }))}
          >
            <option value="">Elegir amigo</option>
            {directory.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {(profile.display_name || profile.email) + ' Â· ' + profile.email}
              </option>
            ))}
          </select>

          <select
            value={tradeForm.offeredStickerId}
            onChange={(event) => onChangeTradeForm((prev) => ({ ...prev, offeredStickerId: event.target.value }))}
          >
            <option value="">Tu repetida a ofrecer</option>
            {repeatedCards.map((card) => (
              <option key={card.id} value={card.id}>
                {card.name} Â· x{Math.max(0, (ownedMap[card.id] || 0) - 1)}
              </option>
            ))}
          </select>

          <select
            value={tradeForm.requestedStickerId}
            onChange={(event) => onChangeTradeForm((prev) => ({ ...prev, requestedStickerId: event.target.value }))}
          >
            <option value="">Figurita que querÃ©s pedir</option>
            {albumCards.map((card) => (
              <option key={card.id} value={card.id}>
                {card.name} Â· {card.team}
              </option>
            ))}
          </select>

          <input
            placeholder="Nota opcional"
            value={tradeForm.note}
            onChange={(event) => onChangeTradeForm((prev) => ({ ...prev, note: event.target.value }))}
          />

          <button
            className="primary-button"
            type="submit"
            disabled={busy || !tradeForm.targetUserId || !tradeForm.offeredStickerId || !tradeForm.requestedStickerId}
          >
            <Users size={16} />
            Enviar oferta
          </button>
        </form>
      </section>

      <section className="trade-feed">
        <span className="section-kicker">Bandeja</span>
        <h2>Ofertas enviadas y recibidas</h2>
        {!trades.length && <div className="empty-state">Todavia no hay ofertas reales cargadas.</div>}
        <div className="trade-list">
          {trades.map((trade) => {
            const isIncoming = trade.requested_with === currentUserId;
            const offeredItem = trade.items.find((item) => item.owner_user_id === trade.offered_by);
            const requestedItem = trade.items.find((item) => item.owner_user_id === trade.requested_with);
            return (
              <article className="trade-card trade-card-rich" key={trade.id}>
                <div className="trade-card-header">
                  <div>
                    <p>{isIncoming ? 'Te ofrecen un canje' : 'Oferta enviada'}</p>
                    <span>{new Date(trade.created_at).toLocaleString()}</span>
                  </div>
                  <strong>{trade.status}</strong>
                </div>

                <div className="trade-players">
                  <div className="trade-player-block">
                    <small>Ofrece</small>
                    <b>{trade.offered_by_profile?.display_name || trade.offered_by_profile?.email || 'Jugador'}</b>
                    <span>{offeredItem?.card?.name || 'Figurita'}</span>
                  </div>
                  <div className="trade-arrow">por</div>
                  <div className="trade-player-block">
                    <small>Pide</small>
                    <b>{trade.requested_with_profile?.display_name || trade.requested_with_profile?.email || 'Jugador'}</b>
                    <span>{requestedItem?.card?.name || 'Figurita'}</span>
                  </div>
                </div>

                {trade.note && <p className="trade-note">{trade.note}</p>}

                {trade.status === 'pending' && isIncoming && (
                  <div className="trade-actions">
                    <button className="primary-button" onClick={() => onRespond(trade.id, 'accepted')} disabled={busy}>
                      Aceptar
                    </button>
                    <button className="ghost-button" onClick={() => onRespond(trade.id, 'rejected')} disabled={busy}>
                      Rechazar
                    </button>
                  </div>
                )}

                {trade.status === 'pending' && !isIncoming && (
                  <div className="trade-actions">
                    <button className="ghost-button" onClick={() => onRespond(trade.id, 'cancelled')} disabled={busy}>
                      Cancelar oferta
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function AchievementsView({ achievements }) {
  const completed = achievements.filter((achievement) => achievement.completed).length;

  return (
    <section className="achievements-board">
      <div className="achievement-summary">
        <span className="section-kicker">Mision del album</span>
        <h2>{completed} logros desbloqueados</h2>
        <p>
          Estas metas convierten el progreso en objetivos concretos: completar selecciones, juntar
          repetidas, abrir sobres y desbloquear insignias de coleccionista.
        </p>
      </div>

      <div className="achievement-grid">
        {achievements.map((achievement) => (
          <article
            className={achievement.completed ? 'achievement-card completed' : 'achievement-card'}
            key={achievement.id}
          >
            <div className="achievement-head">
              <span className="achievement-icon">
                <Award size={18} />
              </span>
              <strong>{achievement.title}</strong>
            </div>
            <p>{achievement.description}</p>
            <div className="achievement-progress">
              <div className="achievement-progress-bar">
                <span style={{ width: `${achievement.completion}%` }} />
              </div>
              <small>
                {achievement.current}/{achievement.target}
              </small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

async function resolvePhotoUrl(wikiTitle) {
  if (!wikiTitle) return null;
  if (photoCache.has(wikiTitle)) return photoCache.get(wikiTitle);

  try {
    const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`);
    if (!response.ok) throw new Error('No photo');
    const payload = await response.json();
    const image = payload.thumbnail?.source || payload.originalimage?.source || null;
    photoCache.set(wikiTitle, image);
    return image;
  } catch {
    photoCache.set(wikiTitle, null);
    return null;
  }
}

async function resolveSummary(wikiTitle) {
  if (!wikiTitle) return null;
  if (summaryCache.has(wikiTitle)) return summaryCache.get(wikiTitle);

  try {
    const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`);
    if (!response.ok) throw new Error('No summary');
    const payload = await response.json();
    const summary = payload.extract || null;
    summaryCache.set(wikiTitle, summary);
    return summary;
  } catch {
    summaryCache.set(wikiTitle, null);
    return null;
  }
}

function buildFallbackSummary(card) {
  if (!card) return '';

  if (card.role === 'coach') {
    return `${card.name} es el director tecnico de ${card.team} en esta coleccion, con una propuesta apoyada en el sistema ${card.formation}.`;
  }

  const status = card.isStarter ? 'titular' : 'parte del banco';
  return `${card.name} forma parte de ${card.team} como ${card.position} y aparece en el album como ${status} dentro del esquema ${card.formation}.`;
}

function PlayerPortrait({ card, visible }) {
  const [photoUrl, setPhotoUrl] = useState(() => photoCache.get(card.wikiTitle) || null);

  useEffect(() => {
    let active = true;
    if (!visible || !card.wikiTitle) return undefined;

    if (photoCache.has(card.wikiTitle)) {
      setPhotoUrl(photoCache.get(card.wikiTitle) || null);
      return undefined;
    }

    resolvePhotoUrl(card.wikiTitle).then((url) => {
      if (active) setPhotoUrl(url);
    });

    return () => {
      active = false;
    };
  }, [card.wikiTitle, visible]);

  if (photoUrl) return <img className="player-photo" src={photoUrl} alt={card.name} loading="lazy" />;

  return (
    <div className="player-photo fallback-photo">
      <UserRound size={36} />
      <span>{card.code}</span>
    </div>
  );
}

function StickerCard({ card, count, fresh = false, onSelect }) {
  const isOwned = count > 0;
  const rarity = rarityConfig[card.rarity];
  const clickable = isOwned && typeof onSelect === 'function';
  const handleSelect = () => {
    if (clickable) onSelect(card);
  };

  return (
    <article
      className={`sticker-card ${card.rarity} ${isOwned ? 'owned' : 'locked'} ${clickable ? 'clickable' : ''}`}
      style={{
        '--team-accent-a': card.colors[0],
        '--team-accent-b': card.colors[1],
        '--rarity-accent': rarity.accent,
      }}
      onClick={clickable ? handleSelect : undefined}
      onKeyDown={
        clickable
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleSelect();
              }
            }
          : undefined
      }
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      <div className="sticker-frame">
        {fresh && <span className="new-badge">Nueva</span>}
        {!fresh && count > 1 && <span className="new-badge repeat-badge">Repetida</span>}

        <div className="sticker-top">
          <span>{card.number}</span>
          <small>{rarity.label}</small>
        </div>

        <div className="portrait-shell">
          {isOwned ? <PlayerPortrait card={card} visible /> : <div className="locked-portrait">{card.code}</div>}
        </div>

        <div className="sticker-body">
          <p className="sticker-team">{isOwned ? card.team : 'Seleccion oculta'}</p>
          <h3>{isOwned ? card.name : 'Figurita bloqueada'}</h3>
          <p className="sticker-meta">
            {isOwned
              ? `${card.position} Â· ${card.role === 'coach' ? 'DT' : card.isStarter ? 'Titular' : 'Banco'}`
              : 'Abri sobres para descubrirla'}
          </p>
          {isOwned && (
            <button
              type="button"
              className="sticker-open-button"
              onClick={(event) => {
                event.stopPropagation();
                handleSelect();
              }}
            >
              Ver ficha
            </button>
          )}
        </div>

        <footer className="sticker-footer">
          <span>{card.formation}</span>
          <strong>{count > 1 ? `x${count}` : isOwned ? 'Coleccionada' : 'Pendiente'}</strong>
        </footer>
      </div>
    </article>
  );
}

function PlayerModal({ card, onClose }) {
  const [summary, setSummary] = useState('');

  useEffect(() => {
    let active = true;

    if (!card) {
      setSummary('');
      return undefined;
    }

    setSummary('');
    resolveSummary(card.wikiTitle).then((text) => {
      if (active) setSummary(text || buildFallbackSummary(card));
    });

    return () => {
      active = false;
    };
  }, [card]);

  if (!card) return null;

  const rarity = rarityConfig[card.rarity];
  const roleLabel = card.role === 'coach' ? 'Director tecnico' : card.isStarter ? 'Titular' : 'Banco';

  return (
    <AnimatePresence>
      <motion.div className="player-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
        <motion.aside
          className="player-modal"
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.2 }}
          onClick={(event) => event.stopPropagation()}
        >
          <button type="button" className="player-modal-close" onClick={onClose} aria-label="Cerrar ficha">
            X
          </button>

          <div className="player-modal-media" style={{ '--team-accent-a': card.colors[0], '--team-accent-b': card.colors[1] }}>
            <PlayerPortrait card={card} visible />
          </div>

          <div className="player-modal-copy">
            <span className="section-kicker">{card.team}</span>
            <h2>{card.name}</h2>
            <div className="player-modal-meta">
              <span>{card.number}</span>
              <span>{card.position}</span>
              <span>{roleLabel}</span>
              <span>{rarity.label}</span>
            </div>
            <p>{summary || buildFallbackSummary(card)}</p>
            <div className="player-modal-details">
              <strong>{card.formation}</strong>
              <small>Esquema del equipo</small>
            </div>
          </div>
        </motion.aside>
      </motion.div>
    </AnimatePresence>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
