const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const store = {
  get(key, fallback){try{return JSON.parse(localStorage.getItem("vd_"+key)) ?? fallback}catch{return fallback}},
  set(key,value){localStorage.setItem("vd_"+key,JSON.stringify(value))}
};
let number = "", contactSource = "All", historyFilter = "All";
let contacts = store.get("contacts", []);
let history = store.get("history", []);
const toast = (msg) => {const el=$("#toast");el.textContent=msg;el.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove("show"),2300)};
const safe = (v) => String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function navigate(page){
  $$(".page").forEach(p=>p.classList.toggle("active",p.id==="page-"+page));
  $$(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
  closeDrawer(); if(page==="contacts")renderContacts(); if(page==="history")renderHistory();
  window.scrollTo({top:0,behavior:"smooth"});
}
$$("[data-page]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.page)));
$$("[data-go]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.go)));
$("#menuBtn").addEventListener("click",openDrawer);$("#closeDrawer").addEventListener("click",closeDrawer);$("#drawerBackdrop").addEventListener("click",closeDrawer);
function openDrawer(){$("#drawer").classList.add("open");$("#drawerBackdrop").classList.add("open")}
function closeDrawer(){$("#drawer").classList.remove("open");$("#drawerBackdrop").classList.remove("open")}
$("#searchBtn").addEventListener("click",()=>{$("#searchPanel").classList.toggle("hidden");if(!$("#searchPanel").classList.contains("hidden"))$("#globalSearch").focus()});
$("#closeSearch").addEventListener("click",()=>$("#searchPanel").classList.add("hidden"));
$("#globalSearch").addEventListener("input",e=>{const q=e.target.value.toLowerCase();if(q){navigate("contacts");$("#contactSearch").value=q;renderContacts()}});
function updateNumber(){$("#numberDisplay").textContent=number||"Enter number";$("#numberDisplay").style.color=number?"var(--text)":"var(--muted)"}
$("#keypad").addEventListener("click",e=>{const key=e.target.closest("[data-digit]");if(!key)return;if(number.length<24)number+=key.dataset.digit;updateNumber();});
$("#deleteNumber").addEventListener("click",()=>{number=number.slice(0,-1);updateNumber()});
$("#saveNumber").addEventListener("click",()=>{if(!number){toast("Enter a number first.");return}openContact(number)});
$("#callBtn").addEventListener("click",()=>{
  const clean=number.replace(/[^\d+*#]/g,"");if(!clean){toast("Enter a phone number first.");return}
  history.unshift({name:findName(clean)||clean,phone:clean,type:"Outgoing",time:new Date().toISOString()});history=history.slice(0,100);store.set("history",history);renderHome();
  location.href="tel:"+encodeURIComponent(clean);
});
$("#simSelect").addEventListener("click",()=>toast("SIM selection will be available in the native Android app."));
function findName(phone){return contacts.find(c=>c.phone.replace(/\s/g,"")===phone.replace(/\s/g,""))?.name||""}
function openContact(prefill=""){$("#newName").value="";$("#newPhone").value=prefill;$("#contactDialog").showModal();if(prefill)$("#newName").focus();else $("#newName").focus()}
$("#addContact").addEventListener("click",()=>openContact());
$("#closeContact").addEventListener("click",()=>$("#contactDialog").close());
$("#contactForm").addEventListener("submit",e=>{e.preventDefault();const name=$("#newName").value.trim(),phone=$("#newPhone").value.trim(),source=$("#newSource").value;if(!name||!phone)return;contacts.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),name,phone,source});store.set("contacts",contacts);$("#contactDialog").close();renderContacts();renderHome();toast("Contact saved in this browser.");});
function contactMarkup(c){return `<div class="call-row"><div class="avatar">${safe(c.name.trim().charAt(0).toUpperCase())}</div><div class="row-info"><b>${safe(c.name)}</b><small>${safe(c.phone)} · ${safe(c.source)}</small></div><button class="row-action" data-call="${safe(c.phone)}" aria-label="Call contact">☎</button></div>`}
function renderContacts(){const q=($("#contactSearch")?.value||"").toLowerCase();const filtered=contacts.filter(c=>(contactSource==="All"||c.source===contactSource)&&(c.name.toLowerCase().includes(q)||c.phone.toLowerCase().includes(q)));$("#contactList").innerHTML=filtered.length?filtered.map(contactMarkup).join():'<div class="empty-state">No matching contacts.<br><small>Add a contact or change your filter.</small></div>'}
$("#contactList").addEventListener("click",e=>{const b=e.target.closest("[data-call]");if(b){const p=b.dataset.call;number=p;updateNumber();navigate("dial")}});
$("#contactSearch").addEventListener("input",renderContacts);
$$("[data-source]").forEach(b=>b.addEventListener("click",()=>{contactSource=b.dataset.source;$$("[data-source]").forEach(x=>x.classList.toggle("active",x===b));renderContacts()}));
function renderHistory(){const filtered=history.filter(h=>historyFilter==="All"||h.type===historyFilter);$("#historyList").innerHTML=filtered.length?filtered.map(h=>`<div class="call-row"><div class="avatar">${h.type==="Missed"?"↙":h.type==="Incoming"?"↘":"↗"}</div><div class="row-info"><b>${safe(h.name)}</b><small>${h.type} · ${new Date(h.time).toLocaleString()}</small></div><button class="row-action" data-call="${safe(h.phone)}">☎</button></div>`).join():'<div class="empty-state">No calls in this filter.<br><small>Prototype call activity appears here.</small></div>'}
$$("[data-filter]").forEach(b=>b.addEventListener("click",()=>{historyFilter=b.dataset.filter;$$("[data-filter]").forEach(x=>x.classList.toggle("active",x===b));renderHistory()}));
$("#historyList").addEventListener("click",e=>{const b=e.target.closest("[data-call]");if(b){number=b.dataset.call;updateNumber();navigate("dial")}});
$("#clearHistory").addEventListener("click",()=>{history=[];store.set("history",history);renderHistory();renderHome();toast("Prototype history cleared.")});
function renderHome(){const recent=history.slice(0,4);$("#homeRecent").innerHTML=recent.length?recent.map(h=>`<div class="call-row"><div class="avatar">${h.type==="Missed"?"↙":"↗"}</div><div class="row-info"><b>${safe(h.name)}</b><small>${h.type} · ${new Date(h.time).toLocaleString()}</small></div><button class="row-action" data-call="${safe(h.phone)}">☎</button></div>`).join():'<div class="empty-state">No recent calls yet.<br><small>Your activity will appear here.</small></div>'}
$("#homeRecent").addEventListener("click",e=>{const b=e.target.closest("[data-call]");if(b){number=b.dataset.call;updateNumber();navigate("dial")}});
$("#themeSelect").addEventListener("change",e=>{document.body.classList.remove("theme-rose","theme-ocean","theme-mono");if(e.target.value!=="violet")document.body.classList.add("theme-"+e.target.value);store.set("theme",e.target.value)});
$("#glassRange").addEventListener("input",e=>{document.documentElement.style.setProperty("--blur",e.target.value+"px")});
$("#touchToggle").addEventListener("change",e=>document.body.classList.toggle("no-touch",!e.target.checked));
$("#motionToggle").addEventListener("change",e=>document.body.classList.toggle("reduce-motion",e.target.checked));
const savedTheme=store.get("theme","violet");$("#themeSelect").value=savedTheme;if(savedTheme!=="violet")document.body.classList.add("theme-"+savedTheme);
updateNumber();renderHome();renderContacts();renderHistory();
if("serviceWorker" in navigator && location.protocol.startsWith("http"))window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
