import React, { useState } from 'react'
import { Shield, Lock, FileText, ChevronDown, ChevronUp } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

const TABS = [
  { id: 'cgu',            label: 'CGU',              icon: FileText },
  { id: 'confidentialite',label: 'Confidentialité',  icon: Lock },
  { id: 'mentions',       label: 'Mentions légales', icon: Shield },
]

// ── Accordéon section ──────────────────────────────────────────────────────
function Section({ title, children }) {
  const [open, setOpen] = useState(true)
  return (
    <div style={{ borderBottom: '1px solid var(--border)', marginBottom: 0 }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
        <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{title}</span>
        {open ? <ChevronUp size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} /> : <ChevronDown size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />}
      </button>
      {open && (
        <div style={{ paddingBottom: 16, fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
          {children}
        </div>
      )}
    </div>
  )
}

function P({ children }) {
  return <p style={{ marginBottom: 10 }}>{children}</p>
}
function Li({ children }) {
  return <li style={{ marginBottom: 6, paddingLeft: 4 }}>• {children}</li>
}

// ── CGU ───────────────────────────────────────────────────────────────────
function CGU() {
  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
        Dernière mise à jour : 22 mars 2026 — Version 1.0
      </p>

      <Section title="1. Objet et champ d'application">
        <P>Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme <strong>Copilote</strong>, éditée par la société Copilote SAS, accessible à l'adresse app.copilote.fr.</P>
        <P>En créant un compte et en utilisant le Service, vous acceptez sans réserve les présentes CGU. Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser le Service.</P>
      </Section>

      <Section title="2. Description du Service">
        <P>Copilote est une solution SaaS destinée aux professionnels de l'automobile (négociants, marchands de véhicules d'occasion, concessionnaires) permettant de :</P>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <Li>Gérer le Livre de Police électronique conformément à l'article L321-1 du Code de la route</Li>
          <Li>Générer des documents de vente administratifs (factures, certificats de cession, bon de commande)</Li>
          <Li>Gérer une base clients et un stock de véhicules</Li>
          <Li>Accéder à des statistiques de vente</Li>
        </ul>
      </Section>

      <Section title="3. Accès au Service et création de compte">
        <P>L'utilisation du Service requiert la création d'un compte professionnel. Vous vous engagez à fournir des informations exactes, complètes et à jour. Vous êtes responsable de la confidentialité de vos identifiants de connexion.</P>
        <P>Copilote se réserve le droit de suspendre ou clôturer tout compte en cas d'utilisation frauduleuse, contraire aux présentes CGU ou aux lois en vigueur.</P>
      </Section>

      <Section title="4. Abonnement et facturation">
        <P>Le Service est proposé sous forme d'abonnement mensuel ou annuel. Les tarifs en vigueur sont affichés sur la page Tarifs de la plateforme.</P>
        <P>Tout abonnement est reconduit automatiquement sauf résiliation au moins 24h avant la date de renouvellement. Le paiement est effectué par carte bancaire via notre prestataire sécurisé Stripe.</P>
        <P>En cas de non-paiement, l'accès au Service peut être suspendu après mise en demeure restée sans réponse sous 7 jours.</P>
      </Section>

      <Section title="5. Obligations de l'utilisateur">
        <P>Vous vous engagez à :</P>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <Li>Utiliser le Service conformément à la législation en vigueur et aux réglementations applicables aux professionnels de l'automobile</Li>
          <Li>Ne pas tenter de contourner les mécanismes de sécurité de la plateforme</Li>
          <Li>Veiller à la conformité des données saisies (informations clients, véhicules, transactions)</Li>
          <Li>Informer immédiatement Copilote de toute utilisation non autorisée de votre compte</Li>
          <Li>Ne pas utiliser le Service pour des activités illégales ou frauduleuses</Li>
        </ul>
      </Section>

      <Section title="6. Propriété intellectuelle">
        <P>La plateforme Copilote, son code source, son design, ses contenus et marques sont la propriété exclusive de Copilote SAS et sont protégés par les lois sur la propriété intellectuelle.</P>
        <P>Toute reproduction, représentation ou exploitation non autorisée est strictement interdite et constitue une contrefaçon.</P>
      </Section>

      <Section title="7. Disponibilité et garanties">
        <P>Copilote s'engage à assurer une disponibilité du Service de 99,5% par mois hors maintenance planifiée. En cas d'interruption majeure, les utilisateurs sont informés via email et tableau de bord.</P>
        <P>Copilote ne saurait être tenu responsable des dommages indirects résultant d'une interruption de service, perte de données ou dysfonctionnement technique.</P>
      </Section>

      <Section title="8. Résiliation">
        <P>Vous pouvez résilier votre abonnement à tout moment depuis votre espace client. La résiliation prend effet à la fin de la période en cours. Aucun remboursement prorata n'est effectué sauf dans le cadre de notre garantie satisfait ou remboursé de 14 jours.</P>
        <P>En cas de résiliation, vos données sont conservées 30 jours puis supprimées définitivement, sauf obligation légale contraire (Livre de Police soumis à archivage réglementaire).</P>
      </Section>

      <Section title="9. Modification des CGU">
        <P>Copilote se réserve le droit de modifier les présentes CGU à tout moment. Toute modification substantielle vous sera notifiée par email 30 jours avant son entrée en vigueur. La poursuite de l'utilisation du Service vaut acceptation des nouvelles conditions.</P>
      </Section>

      <Section title="10. Droit applicable et juridiction">
        <P>Les présentes CGU sont régies par le droit français. Tout litige relatif à leur interprétation ou exécution sera soumis aux tribunaux compétents de Paris, sauf disposition légale contraire.</P>
      </Section>
    </div>
  )
}

// ── Politique de confidentialité ──────────────────────────────────────────
function Confidentialite() {
  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
        Dernière mise à jour : 22 mars 2026 — Conformément au RGPD (Règlement UE 2016/679)
      </p>

      <Section title="1. Responsable du traitement">
        <P><strong>Copilote SAS</strong> — Responsable du traitement des données personnelles.</P>
        <P>Contact DPO : <span style={{ color: 'var(--accent)' }}>privacy@copilote.fr</span></P>
      </Section>

      <Section title="2. Données collectées">
        <P><strong>Données de compte :</strong> nom, prénom, email, nom du garage, téléphone, adresse.</P>
        <P><strong>Données professionnelles :</strong> informations clients de votre garage, véhicules, transactions. Ces données vous appartiennent — vous en êtes le responsable de traitement.</P>
        <P><strong>Données de navigation :</strong> logs de connexion, adresse IP, type de navigateur (à des fins de sécurité uniquement).</P>
        <P><strong>Données de paiement :</strong> traitées directement par Stripe — Copilote ne stocke jamais vos coordonnées bancaires.</P>
      </Section>

      <Section title="3. Finalités et bases légales">
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <Li><strong>Exécution du contrat</strong> — fourniture du Service, gestion de votre compte, support</Li>
          <Li><strong>Intérêt légitime</strong> — sécurité de la plateforme, amélioration du Service, lutte contre la fraude</Li>
          <Li><strong>Consentement</strong> — communications marketing (désactivables à tout moment)</Li>
          <Li><strong>Obligation légale</strong> — conservation des données comptables et fiscales</Li>
        </ul>
      </Section>

      <Section title="4. Durée de conservation">
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <Li>Données de compte : durée de l'abonnement + 30 jours après résiliation</Li>
          <Li>Données de vente et Livre de Police : 5 ans (obligation comptable) ou selon réglementation automobile applicable</Li>
          <Li>Logs de sécurité : 12 mois</Li>
          <Li>Données de paiement : selon politique de Stripe</Li>
        </ul>
      </Section>

      <Section title="5. Sous-traitants et transferts">
        <P>Copilote fait appel aux sous-traitants suivants, tous encadrés par des contrats de traitement conformes RGPD :</P>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <Li><strong>Supabase Inc.</strong> — hébergement base de données (serveurs EU)</Li>
          <Li><strong>Stripe Inc.</strong> — paiement en ligne (certifié PCI-DSS)</Li>
          <Li><strong>Resend / SendGrid</strong> — envoi d'emails transactionnels</Li>
          <Li><strong>n8n</strong> — automatisation et génération de documents</Li>
        </ul>
        <P>Aucune donnée personnelle n'est vendue ni cédée à des tiers à des fins commerciales.</P>
      </Section>

      <Section title="6. Vos droits (RGPD)">
        <P>Conformément au RGPD, vous disposez des droits suivants sur vos données personnelles :</P>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <Li><strong>Droit d'accès</strong> — obtenir une copie de vos données</Li>
          <Li><strong>Droit de rectification</strong> — corriger des données inexactes</Li>
          <Li><strong>Droit à l'effacement</strong> — demander la suppression de vos données</Li>
          <Li><strong>Droit à la portabilité</strong> — recevoir vos données dans un format lisible par machine</Li>
          <Li><strong>Droit d'opposition</strong> — vous opposer à certains traitements</Li>
          <Li><strong>Droit à la limitation</strong> — limiter le traitement de vos données</Li>
        </ul>
        <P>Pour exercer ces droits : <span style={{ color: 'var(--accent)' }}>privacy@copilote.fr</span> — réponse sous 30 jours.</P>
        <P>Vous pouvez également introduire une réclamation auprès de la CNIL (www.cnil.fr).</P>
      </Section>

      <Section title="7. Cookies">
        <P>Copilote utilise uniquement des cookies strictement nécessaires au fonctionnement du Service (session, préférences d'affichage). Aucun cookie publicitaire ou de tracking tiers n'est utilisé sans votre consentement explicite.</P>
      </Section>

      <Section title="8. Sécurité">
        <P>Vos données sont protégées par chiffrement TLS en transit et AES-256 au repos. L'accès aux données de production est restreint et audité. Nous appliquons les principes de Privacy by Design et de minimisation des données.</P>
      </Section>
    </div>
  )
}

// ── Mentions légales ──────────────────────────────────────────────────────
function Mentions() {
  return (
    <div>
      <Section title="Éditeur du site">
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <Li><strong>Raison sociale :</strong> Copilote SAS</Li>
          <Li><strong>Forme juridique :</strong> Société par Actions Simplifiée</Li>
          <Li><strong>Capital social :</strong> 1 000 €</Li>
          <Li><strong>Siège social :</strong> France</Li>
          <Li><strong>SIRET :</strong> En cours d'enregistrement</Li>
          <Li><strong>TVA intracommunautaire :</strong> En cours</Li>
          <Li><strong>Email :</strong> contact@copilote.fr</Li>
        </ul>
      </Section>

      <Section title="Directeur de la publication">
        <P>Le directeur de la publication est le représentant légal de Copilote SAS.</P>
      </Section>

      <Section title="Hébergement">
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <Li><strong>Base de données :</strong> Supabase Inc. — 970 Toa Payoh North, Singapore 318992 — Serveurs localisés en Union Européenne</Li>
          <Li><strong>Frontend :</strong> Vercel Inc. — 340 S Lemon Ave #4133, Walnut, CA 91789, USA</Li>
        </ul>
      </Section>

      <Section title="Propriété intellectuelle">
        <P>L'ensemble des contenus présents sur la plateforme Copilote (textes, graphismes, logo, icônes, code source) est protégé par le droit d'auteur et le droit des marques. Toute reproduction sans autorisation est interdite.</P>
      </Section>

      <Section title="Limitation de responsabilité">
        <P>Copilote SAS ne saurait être tenu responsable des dommages directs ou indirects causés au matériel de l'utilisateur lors de l'accès au Service. Les informations fournies sur la plateforme le sont à titre indicatif et ne sauraient se substituer à un conseil juridique professionnel.</P>
      </Section>

      <Section title="Médiation et règlement des litiges">
        <P>En cas de litige, vous pouvez contacter notre service client à contact@copilote.fr. En l'absence de résolution amiable, vous pouvez recourir à la médiation de la consommation conformément aux articles L.611-1 et suivants du Code de la consommation.</P>
      </Section>

      <Section title="Contact">
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <Li><strong>Email général :</strong> contact@copilote.fr</Li>
          <Li><strong>Support technique :</strong> support@copilote.fr</Li>
          <Li><strong>Données personnelles (DPO) :</strong> privacy@copilote.fr</Li>
        </ul>
      </Section>
    </div>
  )
}

// ── Page principale ───────────────────────────────────────────────────────
export default function Legal() {
  const location = useLocation()
  // Detect tab from hash or default to 'cgu'
  const defaultTab = location.hash?.replace('#', '') || 'cgu'
  const [tab, setTab] = useState(TABS.find(t => t.id === defaultTab)?.id || 'cgu')

  return (
    <div className="fade-in" style={{ maxWidth: 780, margin: '0 auto', padding: '24px 16px 80px' }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 6px' }}>
          Informations légales
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>
          Copilote SAS — Plateforme de gestion automobile pour professionnels
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
        {TABS.map(t => {
          const active = tab === t.id
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', borderRadius: 10, cursor: 'pointer',
                fontWeight: active ? 700 : 500, fontSize: 13,
                background: active ? 'var(--accent)' : 'var(--bg-card)',
                color: active ? '#fff' : 'var(--text-secondary)',
                border: active ? '1.5px solid var(--accent)' : '1.5px solid var(--border)',
                transition: 'all 0.15s',
              }}>
              <t.icon size={13} />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="sea-card" style={{ padding: '24px 28px' }}>
        {tab === 'cgu'             && <CGU />}
        {tab === 'confidentialite' && <Confidentialite />}
        {tab === 'mentions'        && <Mentions />}
      </div>

      {/* Footer links */}
      <div style={{ marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
            {t.label}
          </button>
        ))}
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>· © 2026 Copilote SAS</span>
      </div>
    </div>
  )
}
