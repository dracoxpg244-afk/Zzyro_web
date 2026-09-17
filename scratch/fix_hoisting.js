const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'public', 'index.html');
let html = fs.readFileSync(targetPath, 'utf8');

// 1. Move ESTADO declarations to the top of <script>
const oldScriptStart = `<script>
/* ═══════════ CANVAS BG ═══════════ */
let bgOn = true;`;

const newScriptStart = `<script>
/* ═══════════ ESTADO GLOBAL ═══════════ */
var role = null;
var bgOn = true;
var ws = null, localStream = null, pcs = {}, viewerPC = null, roomId = null, viewerId = null;
var myName = localStorage.getItem('ss_name') || 'Host';
var myTag = localStorage.getItem('ss_tag') || '#8321';
var myAv = localStorage.getItem('ss_avatar') || null;
var myRole = 'Dono', rooms = [], allEvts = [], pendRoom = null;
var vMicStream = null, vMicOn = false, deafened = false, hostMuted = false;
var qCfg = { w: 1920, h: 1080, fps: 60 };
var zoom = 100;

/* ═══════════ CANVAS BG ═══════════ */`;

html = html.replace(oldScriptStart, newScriptStart);

// Remove the duplicate declarations in the old ESTADO section
const oldEstadoSection = `/* ═══════════ ESTADO ═══════════ */
let ws=null,localStream=null,pcs={},viewerPC=null,role=null,roomId=null,viewerId=null;
let myName=localStorage.getItem('ss_name')||'Host';
let myTag=localStorage.getItem('ss_tag')||'#8321';
let myAv=localStorage.getItem('ss_avatar')||null;
let myRole='Dono',rooms=[],allEvts=[],pendRoom=null;
let vMicStream=null,vMicOn=false,deafened=false,hostMuted=false;
let qCfg={w:1920,h:1080,fps:60};
let zoom=100;`;

const newEstadoSection = `/* ═══════════ ESTADO (Inicializado no topo) ═══════════ */`;

html = html.replace(oldEstadoSection, newEstadoSection);

// Also make sure draw() check is safe:
html = html.replace(
  `if(!bgOn || role === 'host' || role === 'viewer'){`,
  `if(!bgOn || (typeof role !== 'undefined' && (role === 'host' || role === 'viewer'))){`
);

fs.writeFileSync(targetPath, html, 'utf8');
console.log('Fixed variable declaration and hoisting! New size:', fs.statSync(targetPath).size);
