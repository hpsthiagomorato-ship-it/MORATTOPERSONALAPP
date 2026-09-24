const DB_KEY='moratto_personal_db_v1';
const seed={accounts:[{login:'aluno',password:'123456',role:'student',name:'Aluno Demonstração',studentId:'stu-1'},{login:'raylton',password:'123456',role:'admin',name:'Raylton Morato'}],students:[{id:'stu-1',name:'Aluno Demonstração',email:'aluno@demo.com',phone:'(92) 99999-9999',goal:'Hipertrofia',weight:78}],workouts:[{id:'w-1',name:'Treino A — Full Body',studentId:'stu-1',items:[{name:'Agachamento',sets:4,reps:'8-10',done:false},{name:'Supino reto',sets:4,reps:'8-10',done:false},{name:'Remada',sets:4,reps:'10-12',done:false}]}],events:[],payments:[],assessments:[],messages:[]};
function cloneSeed(){return JSON.parse(JSON.stringify(seed));}
function loadDB(){try{const raw=localStorage.getItem(DB_KEY);if(!raw)throw new Error('empty');const parsed=JSON.parse(raw);if(!parsed||!Array.isArray(parsed.accounts)||!Array.isArray(parsed.students)||!Array.isArray(parsed.workouts))throw new Error('invalid');return parsed;}catch(error){const fallback=cloneSeed();localStorage.setItem(DB_KEY,JSON.stringify(fallback));return fallback;}}
function saveDB(db){localStorage.setItem(DB_KEY,JSON.stringify(db));}
function getSession(){try{return JSON.parse(sessionStorage.getItem('moratto_auth')||'null');}catch(error){clearSession();return null;}}
function setSession(account){sessionStorage.setItem('moratto_auth',JSON.stringify(account));}
function clearSession(){sessionStorage.removeItem('moratto_auth');}
function escapeHTML(value){return String(value??'').replace(/[&<>'\"]/g,(char)=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[char]));}
window.MorattoDB={loadDB,saveDB,getSession,setSession,clearSession,escapeHTML};window.loadDB=loadDB;window.saveDB=saveDB;
