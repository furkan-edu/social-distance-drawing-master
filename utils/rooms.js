let rooms = [];

function getRooms(){
    return rooms;
}

// Join user 
function userJoin(id, userName, avatar, x, y, pX, pY, room, inCall, muted) {
  const user = { id, userName, avatar, x, y, pX, pY, lastDraw: "", inCall, muted};

  const foundRoom = rooms.find(r => r.id === room.id);

  const existingRoomUsers = foundRoom.users;
  const findInRoom = existingRoomUsers.findIndex(user => user.id === id)

  if(findInRoom === -1){
    foundRoom.users.push(user)
    foundRoom.game.ranks[user.id] = 0;
  }

  return user;
}

// Get room
function getRoom(id) {
    return rooms.find(room => room.id === id);
}

// create room
function createRoom(room){
    room.id = room.id.replace(/[^a-zA-Z0-9-_]/g, '')
    rooms.push(room)

    return room;
}

function updateRoomCanvas(rid, data) {
    const room = rooms.find(room => room.id === rid)
    if(!room){return;}

    room.canvas.push(data)
    return updateUserPos(data, room)
}

function updateUserPos(data, room){
  let user = room.users.find(user => user.id === data.user.id);

  if(!user) return;

  user.x = data.user.x
  user.y = data.user.y
  user.pX = data.user.pX
  user.pY = data.user.pY
  user.lastDraw = data.user.lastDraw
  
  return room.users;
}

// User leaves chat
function userLeave(uid, rid) {
    const roomIndex = rooms.findIndex(room => room.id === rid);
    if(roomIndex === -1){ return; }

    const existingRoomUsers = rooms[roomIndex].users;
    const findInRoom = existingRoomUsers.findIndex(user => user.id === uid)
  
    if(findInRoom !== -1){
      // decide whether to reset room
      let roomUsers = getRoomUsers(rid)
      
      if(roomUsers.length === 1){
        rooms = rooms.filter(room => room.id !== rid)
      }

      return existingRoomUsers.splice(findInRoom, 1)[0];
    }
}

// Get room users
function getRoomUsers(roomId) {
    const room = rooms.find(r => r.id === roomId);
    if(!room){return;}
    return room.users;
}

// get single user from a room
function getUserFromRoom(rid, uid){
  let room = rooms.find(room => room.id === rid);

  if(!room){return;}

  return room.users.find(user => user.id === uid)
}

function resetRoomCanvas(rid, coll){
  let room = rooms.find(room => room.id === rid);

  if(!room){return;}

  room.canvas = []

  if(coll){
    room.lastCollision = coll;
  }

  return room;
}

function lockRoom(rid){
  let room = rooms.find(room => room.id === rid);

  if(!room){return;}

  room.locked = !room.locked

  return room.locked
}

function updateCanvasBG(rid, color){
  let room = rooms.find(room => room.id === rid);

  if(!room){return;}

  room.canvas = []
  room.bg = color
}

function itemToDraw(){
  let thingsToDraw = ["Istanbul deyince akliniza ilk gelen sey nedir?",
  "Yesil Cam deyince akliniza gelen sanatci ismi soyleyin?", 
  "Ingiltere denince aklina gelen ilk sey nedir?",
  "Bir kis yemegi soyleyin. ",
  " Akliniza gelen bir meslek nedir?",
"Ailecek gittiginiz bir yer soyleyin. ",
"Gunesli havada yapilan bir aktivite soyleyin. ",
"Cocuklari oyalamak icin yapilan birsey soyleyin.",
" Calmak istediginiz biir enstruman soyleyin. ",
" Kahvaltida olmazsa olmaz dediginiz bir yiyecek soyleyin.",
" Sporda basarili bir ulke soyleyin.",
" ….den/...dan satilik araba, noktali yere ne gelir? (birisini doldurun)",
"Bir balik turu soyleyin",
" Ev anahtarinizi nereye saklama tercih edersiniz? ",
"Kitap ayaraci yerine kullanilan nesenelerden akliniza ilk sey nedir? ",
" Zengin denince akliniza gelen ilk kisi ve karakter kimdir? ",
" Akliniza ilk gelen sutlu tatli nedir? ",
"Yapmasi zor bir tatli soyleyin.",
" Cocuk oyun parkindaki oyuncaklarindan akliniza ilk geleni soyleyin. ",
" Akliniza ilk gelen klasik muzik bestekari soyleyin.",
" Eslerin birbirini uyandirmak icin yaptigi, akliniza gelen ilk sey nedir?",
"Supermarkette bulunan reyonlardan akliniza ilk geleni soyleyin. ",
"Bir super kahraman soyleyin.",
"En cabuk eskiyen bir mobilya soyleyin.",
"Akliniza gelen ilk cerez turu nedir?",
"Ciddi olunmasi gereken bir durum veya organizasyon soyleyin?",
"Marketten alacaginiz ilk sey nedir?",
"Piknige giderken yanina alacaginiz ilk sey nedir?",
"Dugunde takilan takilardan akliniza ilk gelen sey nedir? ",
"Akliniza gelen ilk hosaf turu nedir? ",
"Bir araba markasi soyleyin ",
"Lise derslerinden bir ders adi soyleyin ",
"Bir erkek ismi soyleyin ",
"Bir bayan ismi soyleyin",
"Evde bulunan ve elektrikle calisan bir cihaz soyleyin",
"Bir yaz meyvesi soyleyin ",
"Bir hayvana seslenirken kullanilan bir nida (cagirmak veya kovalamak icin)",
" Elle yemesi daha kolay olan bir yemek soyleyin",
"Tarti veya terazi kullanilan bir meslek soyleyin ",
" Vahsi bir hayvan turu soyleyin",
"Sevimli bir hayvan turu soyleyin",
" Bir sakiz markasi soyleyin ",
"Cocukken oynadiginiz bir sokak oyunu soyleyin",
" Bir osmanli padisahi soyleyin",
"Bir erkek , karisini aradiginda telefonda sordugu bir soru",
"Cocuklarin anne babaya veya ogretmene soyledigi bir yalan",
"Milyoner oldugunuzda alacaginiz ilk seyi soyleyin"]

  let getIndex = (l) =>  Math.floor(Math.random() * (l - 0)) + 0; // gets a random integer

  return thingsToDraw[getIndex(thingsToDraw.length)];
}

function startGame(rid){
  let room = rooms.find(room => room.id === rid);

  if(!room){return;}

  
  let pickItemToDraw = itemToDraw();

  let game = room.game;

  game.round = 1;
  game.timer = Date.now();
  game.currentlyDrawing = pickItemToDraw;
  game.alreadyDrawn.push(pickItemToDraw);
  
  let players = room.users;

  for(let i=0; i < players.length; i++){
    let player = players[i]
    game.ranks[player.id] = 0;
  }

  return room.game;

}

function nextRound(rid){
  let room = rooms.find(room => room.id === rid);

  if(!room){return;}

  let game = room.game;
  
  game.round += 1;
  game.timer = Date.now();

  let pickItemToDraw = itemToDraw();
  while(game.alreadyDrawn.includes(pickItemToDraw)){
    pickItemToDraw = itemToDraw();
  }
  
  game.alreadyDrawn.push(pickItemToDraw);
  game.currentlyDrawing = pickItemToDraw;

  return room.game;
}

function votePlayer(rid, playerId, round){
  let room = rooms.find(room => room.id === rid);

  if(!room){return;}

  let game = room.game;
  game.ranks[playerId] += 1;

  if(!game.rounds[round]){
    game.rounds[round] = 1;
  } else{
    game.rounds[round] += 1;
  }
}


function setGameMode(rid, mode){
  let room = rooms.find(room => room.id === rid);

  if(!room){return;}

  room.game.round = 0;
  room.game.currentlyDrawing = "";
  room.game.justDraw = mode;
}

function updateName(uid, rid, newName){
  const room = rooms.find(r => r.id === rid);

  if(!room){return;}

  const user = room.users.find(user => user.id === uid)

  if(!user){return;}

  let oldName = user.userName;
  user.userName = newName;

  return {oldName, user};
}

function userSetAudio(rid, uid, status){
  const room = rooms.find(r => r.id === rid);

  if(!room){return;}

  const user = room.users.find(user => user.id === uid)

  if(!user){return;}

  user.inAudio = status;

  return room.users.filter(u => u.inAudio).length;
}

function userSetMute(rid, uid, muteStatus){
  const room = rooms.find(r => r.id === rid);

  if(!room){return;}

  const user = room.users.find(user => user.id === uid)

  if(!user){return;}

  user.muted = muteStatus;

  return user.muted;
}

module.exports = {
  getRooms,
  getRoom,
  createRoom,
  userJoin,
  updateRoomCanvas,
  userLeave,
  getRoomUsers,
  getUserFromRoom,
  resetRoomCanvas,
  lockRoom,
  updateCanvasBG,
  startGame,
  nextRound,
  votePlayer,
  userSetAudio,
  userSetMute,
  setGameMode,
  updateName
};