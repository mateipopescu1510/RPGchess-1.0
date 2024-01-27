var GameBundle;(()=>{"use strict";var t={473:function(t,e,i){var r=this&&this.__createBinding||(Object.create?function(t,e,i,r){void 0===r&&(r=i);var I=Object.getOwnPropertyDescriptor(e,i);I&&!("get"in I?!e.__esModule:I.writable||I.configurable)||(I={enumerable:!0,get:function(){return e[i]}}),Object.defineProperty(t,r,I)}:function(t,e,i,r){void 0===r&&(r=i),t[r]=e[i]}),I=this&&this.__setModuleDefault||(Object.create?function(t,e){Object.defineProperty(t,"default",{enumerable:!0,value:e})}:function(t,e){t.default=e}),s=this&&this.__importStar||function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var i in t)"default"!==i&&Object.prototype.hasOwnProperty.call(t,i)&&r(e,t,i);return I(e,t),e};Object.defineProperty(e,"__esModule",{value:!0}),e.Board=void 0;var a=i(343),A=s(i(597)),n=function(){function t(t){this.fen=t,this.rows=0,this.columns=0,this.boardSetup=[],this.movesList=[[[-1,-1],[-1,-1],new a.Piece,new a.Piece]],this.whiteKingPosition=[-1,-1],this.blackKingPosition=[-1,-1],this.mustLevelUpCoordinates=[-1,-1],this.halfMoveCounter=0,this.convertFen()}return t.prototype.getBoardSetup=function(){return this.boardSetup},t.prototype.getFen=function(){return this.fen},t.prototype.convertFen=function(){var t=this;this.fen.split("/").forEach((function(e,i){if(0===i){var r=e.split(" ");t.rows=Number(r[0]),t.columns=Number(r[1]),t.boardSetup=[];for(var I=0;I<t.rows;I++){t.boardSetup[I]=[];for(var s=0;s<t.columns;s++)t.boardSetup[I][s]=new a.Piece}}else{var n=0,o=0;for(I=0;I<e.length;I++){var E=A.default.stringToPiece(e[I]),_=E[0],l=E[1];if(_!==A.Type.EMPTY){n+=o,o=0;var u=!0,p=[],L=0,T=0;if("["===e[I+1])for(I+=2;"]"!==e[I];)if("X"!==e[I])if("a"!==e[I])if("x"!==e[I])if("l"!==e[I]);else{for(var h="";e[I+1]>="0"&&e[I+1]<="9";)h+=e[I+1],I++;T=parseInt(h),I++}else{for(var c="";e[I+1]>="0"&&e[I+1]<="9";)c+=e[I+1],I++;L=parseInt(c),I++}else{for(;e[I+1]>="0"&&e[I+1]<="9";){var P=parseInt(e[I+1]+e[I+2]+e[I+3]);p.push([P,0]),I+=3}I++}else u=!1,I++;t.boardSetup[i-1][n]=new a.Piece(l,_,[i-1,n],u,p,L,T),_===A.Type.KING&&(l===A.Side.WHITE?t.whiteKingPosition=[i-1,n]:t.blackKingPosition=[i-1,n]),n++}else o=10*o+Number(e[I])}}}))},t.prototype.updateFen=function(){var t=this,e="";this.fen.split("/").forEach((function(i,r){if(r)for(var I=0,s=t.boardSetup[r-1];I<s.length;I++){var a=s[I];if(A.default.isNotEmpty(a)){e+=a.getSide()===A.Side.WHITE?a.getType().toUpperCase():a.getType();var n="";if(a.getCanLevelUp()||(n+="X"),a.getAbilities().length>0){n+="a";for(var o=0,E=a.getAbilities();o<E.length;o++)n+=E[o][0].toString()}a.getXP()&&(n+="x"+a.getXP().toString()),a.getLevel()&&(n+="l"+a.getLevel().toString()),n.length>0&&(n="["+n+"]"),e+=n}else if(isNaN(Number(e.slice(-1))))e+="1";else{var _=(Number(e.slice(-1))+1).toString();e=e.slice(0,-1)+_}}else e+=i;e+="/"})),this.fen=e.slice(0,-1)},t.prototype.movePiece=function(t,e){var i=t[0],r=t[1],I=e[0],s=e[1];if(A.default.isEmpty(this.boardSetup[i][r]))return!1;var n=this.validMoves([i,r]),o=A.default.coordinateInList([I,s],n);if(-1===o)return!1;if(this.getLastMove()[0].toString()!==[-1,-1].toString()&&this.boardSetup[this.getLastMove()[0][0]][this.getLastMove()[0][1]].unhighlight(),this.getLastMove()[1].toString()!==[-1,-1].toString()&&this.boardSetup[this.getLastMove()[1][0]][this.getLastMove()[1][1]].unhighlight(),this.movesList.push([[i,r],[I,s],this.boardSetup[i][r],this.boardSetup[I][s]]),this.checkSpecialConditionsBeforeMove([i,r],[I,s]))return!0;var E=this.boardSetup[I][s].getTotalXP();this.boardSetup[I][s]=this.boardSetup[i][r],this.boardSetup[I][s].getCanLevelUp()&&(this.mustLevelUpCoordinates=this.boardSetup[I][s].addXP(E)?[I,s]:[-1,-1]),i===I&&r===s||(this.boardSetup[i][r]=new a.Piece),this.boardSetup[I][s].getType()===A.Type.KING&&(this.boardSetup[I][s].getSide()===A.Side.WHITE?this.whiteKingPosition=[I,s]:this.blackKingPosition=[I,s]);var _=n[o][2];return _===A.Ability.NONE?this.boardSetup[I][s].incrementMoveCounter():this.boardSetup[I][s].incrementMoveCounter(_),A.default.isKing(this.boardSetup[I][s])&&(this.boardSetup[I][s].getSide()===A.Side.WHITE?this.whiteKingPosition=[I,s]:this.blackKingPosition=[I,s]),this.boardSetup[i][r].highlight(),this.boardSetup[I][s].highlight(),this.halfMoveCounter++,this.checkSpecialConditionsAfterMove([I,s]),this.updateFen(),!0},t.prototype.validMoves=function(t){var e=t[0],i=t[1],r=[],I=this.boardSetup[e][i],s=I.getSide(),a=I.getAbilitiesIDs(),A=I.getAttacks();if(this.checkPassiveAbilities([e,i]))return[];for(var n=0,o=a;n<o.length;n++){var E=o[n];r.push.apply(r,this.checkAbility([e,i],s,E))}for(var _=0,l=A;_<l.length;_++){var u=l[_];r.push.apply(r,this.checkAttacks([e,i],s,u))}return r},t.prototype.checkSpecialConditionsBeforeMove=function(t,e){t[0],t[1];var i=e[0],r=e[1];return!!this.boardSetup[i][r].hasAbility(A.Ability.SHIELD)&&(this.boardSetup[i][r].removeAbility(A.Ability.SHIELD),!0)},t.prototype.checkSpecialConditionsAfterMove=function(t){var e=t[0],i=t[1];if(this.boardSetup[e][i].hasAbility(A.Ability.BOOST_ADJACENT_PIECES))for(var r=0,I=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]];r<I.length;r++){var s=I[r],a=s[0],n=s[1];e+a>=0&&e+a<this.rows&&i+n>=0&&i+n<this.columns&&A.default.sameSidePiece(this.boardSetup[e][i],this.boardSetup[e+a][i+n])&&this.boardSetup[e+a][i+n].increaseCaptureMultiplier(.1)}},t.prototype.checkPassiveAbilities=function(t){var e=t[0],i=t[1];return!(!A.default.isQueen(this.boardSetup[e][i])||!this.getLastMove()[2].hasAbility(A.Ability.SMOLDERING))},t.prototype.checkAbility=function(t,e,i){var r=t[0],I=t[1],s=[];switch(i){case A.Ability.SCOUT:var a=e===A.Side.WHITE?-1:1;return r>1&&r<this.rows-2&&A.default.isEmpty(this.boardSetup[r+a][I])&&A.default.isEmpty(this.boardSetup[r+2*a][I])&&s.push([r+2*a,I,i]),s;case A.Ability.QUANTUM_TUNNELING:return a=e===A.Side.WHITE?-1:1,r>1&&r<this.rows-2&&A.default.isPawn(this.boardSetup[r+a][I])&&A.default.oppositeSide(this.boardSetup[r+a][I],e)&&A.default.isEmpty(this.boardSetup[r+2*a][I])&&s.push([r+2*a,I,i]),s;case A.Ability.CHANGE_COLOR:for(var n=0,o=[-1,1];n<o.length;n++){var E=o[n];I>0&&I<this.columns-1&&A.default.isEmpty(this.boardSetup[r][I+E])&&s.push([r,I+E,i])}return s;case A.Ability.ARCHBISHOP:case A.Ability.CHANCELLOR:case A.Ability.ON_HORSE:return this.checkAttacks([r,I],e,[A.Direction.L,1],i);case A.Ability.CAMEL:case A.Ability.ON_CAMEL:return this.checkAttacks([r,I],e,[A.Direction.CAMEL,1],i);case A.Ability.HAS_PAWN:return this.checkAttacks([r,I],e,[A.Direction.PAWN,1],i);case A.Ability.SKIP:return[[r,I,i]];case A.Ability.BACKWARDS:return r+(a=e===A.Side.WHITE?1:-1)<0||r+a>=this.rows||A.default.isNotEmpty(this.boardSetup[r+a][I])?[]:[[r+a,I,i]]}return s},t.prototype.checkAttacks=function(t,e,i,r){var I=t[0],s=t[1],a=i[0],n=i[1];void 0===r&&(r=A.Ability.NONE);var o=[],E=[];switch(a){case A.Direction.LINE:E=[[1,0],[-1,0],[0,1],[0,-1]];break;case A.Direction.DIAGONAL:E=[[1,1],[-1,1],[1,-1],[-1,-1]];break;case A.Direction.L:E=[[-2,-1],[-2,1],[-1,2],[1,2],[2,1],[2,-1],[1,-2],[-1,-2]];break;case A.Direction.PAWN:return this.checkPawn([I,s],e,n);case A.Direction.CAMEL:E=[[-3,-1],[-3,1],[-1,3],[1,3],[3,1],[3,-1],[1,-3],[-1,-3]]}for(var _=0,l=E;_<l.length;_++)for(var u=l[_],p=u[0],L=u[1],T=1;I+T*p>=0&&I+T*p<this.rows&&s+T*L>=0&&s+T*L<this.columns&&T<=n&&!A.default.sameSide(this.boardSetup[I+T*p][s+T*L],e)&&(o.push([I+T*p,s+T*L,r]),!A.default.oppositeSide(this.boardSetup[I+T*p][s+T*L],e));T++);return o},t.prototype.checkPawn=function(t,e,i){var r=t[0],I=t[1],s=[],a=e===A.Side.WHITE?-1:1;if(e===A.Side.WHITE&&0===r||e===A.Side.BLACK&&r===this.rows-1)return[];0===this.boardSetup[r][I].getMoveCounter()&&1===i&&(i=2);for(var n=1;r+n*a>=0&&r+n*a<this.rows&&n<=i&&!A.default.isNotEmpty(this.boardSetup[r+n*a][I]);n++)s.push([r+n*a,I,A.Ability.NONE]);for(var o=0,E=[-1,1];o<E.length;o++){var _=E[o];I+_>=0&&I+_<this.columns&&A.default.oppositeSide(this.boardSetup[r+a][I+_],e)&&s.push([r+a,I+_,A.Ability.NONE])}return s},t.prototype.getLastMove=function(){return this.movesList[this.movesList.length-1]},t.prototype.printBoard=function(){for(var t=0,e=this.boardSetup;t<e.length;t++){for(var i="",r=0,I=e[t];r<I.length;r++){var s=I[r];i+=s.getSide()===A.Side.WHITE?s.getType().toString().toUpperCase()+" ":s.getType().toString()+" "}console.log(i)}},t.prototype.printValidSquares=function(t){for(var e=t[0],i=t[1],r="",I=this.validMoves([e,i]),s=0;s<this.rows;s++){for(var a="",n=0;n<this.columns;n++)[s,n].toString()==[e,i].toString()?a+="@ ":a+=-1!==A.default.coordinateInList([s,n],I)?"x ":". ";r+=a+"\n"}console.log(r)},t.prototype.getWhiteKingPosition=function(){return this.whiteKingPosition},t.prototype.getBlackKingPosition=function(){return this.blackKingPosition},t.prototype.getLevelUpCoordinates=function(){return this.mustLevelUpCoordinates},t.prototype.getPieceAt=function(t){var e=t[0],i=t[1];return this.boardSetup[e][i]},t.prototype.mustLevelUp=function(){return-1!==this.mustLevelUpCoordinates[0]&&-1!==this.mustLevelUpCoordinates[1]},t.prototype.levelUpDone=function(){this.mustLevelUpCoordinates=[-1,-1]},t}();e.Board=n},306:function(t,e,i){var r=this&&this.__createBinding||(Object.create?function(t,e,i,r){void 0===r&&(r=i);var I=Object.getOwnPropertyDescriptor(e,i);I&&!("get"in I?!e.__esModule:I.writable||I.configurable)||(I={enumerable:!0,get:function(){return e[i]}}),Object.defineProperty(t,r,I)}:function(t,e,i,r){void 0===r&&(r=i),t[r]=e[i]}),I=this&&this.__setModuleDefault||(Object.create?function(t,e){Object.defineProperty(t,"default",{enumerable:!0,value:e})}:function(t,e){t.default=e}),s=this&&this.__importStar||function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var i in t)"default"!==i&&Object.prototype.hasOwnProperty.call(t,i)&&r(e,t,i);return I(e,t),e};Object.defineProperty(e,"__esModule",{value:!0}),e.GameState=void 0;var a=i(473),A=s(i(597)),n=function(){function t(t,e,i,r){this.board=new a.Board(t),this.currentTurn=e,this.timeWhite=i,this.timeBlack=r,this.gameResult=A.GameResult.IN_PROGRESS}return t.prototype.movePiece=function(t,e){return!(this.gameResult!==A.GameResult.IN_PROGRESS||this.board.mustLevelUp()||0===this.currentTurn&&!A.default.isWhite(this.board.getPieceAt(t))||1===this.currentTurn&&!A.default.isBlack(this.board.getPieceAt(t))||!this.board.movePiece(t,e)||(this.changeTurn(),this.checkmate()&&(this.gameResult=0===this.currentTurn?A.GameResult.BLACK_WIN:A.GameResult.WHITE_WIN),0))},t.prototype.levelUp=function(t){var e=this.board.getLevelUpCoordinates(),i=e[0],r=e[1];if(-1===i||-1===r)return!0;var I=this.board.getBoardSetup()[i][r],s=A.Ability[t];return-1!==i&&-1!==r&&(s===A.Ability.NONE?(I.increaseLevel(),this.board.levelUpDone(),!0):!!I.addAbility(s)&&(I.increaseLevel(),this.board.updateFen(),this.board.levelUpDone(),!0))},t.prototype.printBoard=function(){this.board.printBoard()},t.prototype.getBoard=function(){return this.board},t.prototype.getTurn=function(){return this.currentTurn},t.prototype.changeTurn=function(){this.currentTurn=1-this.currentTurn},t.prototype.checkmate=function(){var t=this.board.getLastMove()[1];return 0===this.currentTurn&&t.toString()===this.board.getWhiteKingPosition().toString()||1===this.currentTurn&&t.toString()===this.board.getBlackKingPosition().toString()},t}();e.GameState=n},343:function(t,e,i){var r=this&&this.__createBinding||(Object.create?function(t,e,i,r){void 0===r&&(r=i);var I=Object.getOwnPropertyDescriptor(e,i);I&&!("get"in I?!e.__esModule:I.writable||I.configurable)||(I={enumerable:!0,get:function(){return e[i]}}),Object.defineProperty(t,r,I)}:function(t,e,i,r){void 0===r&&(r=i),t[r]=e[i]}),I=this&&this.__setModuleDefault||(Object.create?function(t,e){Object.defineProperty(t,"default",{enumerable:!0,value:e})}:function(t,e){t.default=e}),s=this&&this.__importStar||function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var i in t)"default"!==i&&Object.prototype.hasOwnProperty.call(t,i)&&r(e,t,i);return I(e,t),e},a=this&&this.__spreadArray||function(t,e,i){if(i||2===arguments.length)for(var r,I=0,s=e.length;I<s;I++)!r&&I in e||(r||(r=Array.prototype.slice.call(e,0,I)),r[I]=e[I]);return t.concat(r||Array.prototype.slice.call(e))};Object.defineProperty(e,"__esModule",{value:!0}),e.Piece=void 0;var A=s(i(597)),n=function(){function t(t,e,i,r,I,s,n,o){var E,_,l,u,p,L,T,h,c,P,C,N;switch(void 0===t&&(t=A.Side.NONE),void 0===e&&(e=A.Type.EMPTY),void 0===i&&(i=[-1,-1]),void 0===r&&(r=!1),void 0===I&&(I=[]),void 0===s&&(s=0),void 0===n&&(n=0),void 0===o&&(o=[]),this.side=t,this.type=e,this.initialSquare=i,this.canLevelUp=r,this.XP=s,this.level=n,this.possibleAbilities=[],this.type){case A.Type.PAWN:this.attacks=[[A.Direction.PAWN,1]],this.levelUpXP=a([],A.default.PAWN_LEVELUP_XP,!0),this.captureMultiplier=A.default.PAWN_CAPTURE_MULTIPLIER,this.abilityCapacity=A.default.PAWN_DEFAULT_ABILITY_CAPACITY,this.maxLevel=A.default.PAWN_MAX_LEVEL,(E=this.possibleAbilities).push.apply(E,A.default.PAWN_ABILITIES),(_=this.possibleAbilities).push.apply(_,A.default.GENERIC_ABILITIES),this.maxAbilityCapacity=A.default.PAWN_MAX_ABILITY_CAPACITY,this.maxCaptureMultiplier=A.default.PAWN_MAX_CAPTURE_MULTIPLIER;break;case A.Type.BISHOP:this.attacks=[[A.Direction.DIAGONAL,A.default.INFINITE_RANGE]],this.levelUpXP=a([],A.default.BISHOP_LEVELUP_XP,!0),this.captureMultiplier=A.default.BISHOP_CAPTURE_MULTIPLIER,this.abilityCapacity=A.default.BISHOP_DEFAULT_ABILITY_CAPACITY,this.maxLevel=A.default.BISHOP_MAX_LEVEL,(l=this.possibleAbilities).push.apply(l,A.default.BISHOP_ABILITIES),(u=this.possibleAbilities).push.apply(u,A.default.GENERIC_ABILITIES),this.maxAbilityCapacity=A.default.BISHOP_MAX_ABILITY_CAPACITY,this.maxCaptureMultiplier=A.default.BISHOP_MAX_CAPTURE_MULTIPLIER;break;case A.Type.KNIGHT:this.attacks=[[A.Direction.L,1]],this.levelUpXP=a([],A.default.KNIGHT_LEVELUP_XP,!0),this.captureMultiplier=A.default.KNIGHT_CAPTURE_MULTIPLIER,this.abilityCapacity=A.default.KNIGHT_DEFAULT_ABILITY_CAPACITY,this.maxLevel=A.default.KNIGHT_MAX_LEVEL,(p=this.possibleAbilities).push.apply(p,A.default.KNIGHT_ABILITIES),(L=this.possibleAbilities).push.apply(L,A.default.GENERIC_ABILITIES),this.maxAbilityCapacity=A.default.KNIGHT_MAX_ABILITY_CAPACITY,this.maxCaptureMultiplier=A.default.KNIGHT_MAX_CAPTURE_MULTIPLIER;break;case A.Type.ROOK:this.attacks=[[A.Direction.LINE,A.default.INFINITE_RANGE]],this.levelUpXP=a([],A.default.ROOK_LEVELUP_XP,!0),this.captureMultiplier=A.default.ROOK_CAPTURE_MULTIPLIER,this.abilityCapacity=A.default.ROOK_DEFAULT_ABILITY_CAPACITY,this.maxLevel=A.default.ROOK_MAX_LEVEL,(T=this.possibleAbilities).push.apply(T,A.default.ROOK_ABILITIES),(h=this.possibleAbilities).push.apply(h,A.default.GENERIC_ABILITIES),this.maxAbilityCapacity=A.default.ROOK_MAX_ABILITY_CAPACITY,this.maxCaptureMultiplier=A.default.ROOK_MAX_CAPTURE_MULTIPLIER;break;case A.Type.QUEEN:this.attacks=[[A.Direction.LINE,A.default.INFINITE_RANGE],[A.Direction.DIAGONAL,A.default.INFINITE_RANGE]],this.levelUpXP=a([],A.default.QUEEN_LEVELUP_XP,!0),this.captureMultiplier=A.default.QUEEN_CAPTURE_MULTIPLIER,this.abilityCapacity=A.default.QUEEN_DEFAULT_ABILITY_CAPACITY,this.maxLevel=A.default.QUEEN_MAX_LEVEL,(c=this.possibleAbilities).push.apply(c,A.default.QUEEN_ABILITIES),(P=this.possibleAbilities).push.apply(P,A.default.GENERIC_ABILITIES),this.maxAbilityCapacity=A.default.QUEEN_MAX_ABILITY_CAPACITY,this.maxCaptureMultiplier=A.default.QUEEN_MAX_CAPTURE_MULTIPLIER;break;case A.Type.KING:this.attacks=[[A.Direction.LINE,1],[A.Direction.DIAGONAL,1],[A.Direction.CASTLING,1]],this.levelUpXP=a([],A.default.KING_LEVELUP_XP,!0),this.captureMultiplier=A.default.KING_CAPTURE_MULTIPLIER,this.abilityCapacity=A.default.KING_DEFAULT_ABILITY_CAPACITY,this.maxLevel=A.default.KING_MAX_LEVEL,(C=this.possibleAbilities).push.apply(C,A.default.KING_ABILITIES),(N=this.possibleAbilities).push.apply(N,A.default.GENERIC_ABILITIES),this.maxAbilityCapacity=A.default.KING_MAX_ABILITY_CAPACITY,this.maxCaptureMultiplier=A.default.KING_MAX_CAPTURE_MULTIPLIER;break;default:this.attacks=[],this.levelUpXP=[],this.captureMultiplier=0,this.abilityCapacity=0,this.maxLevel=0,this.possibleAbilities=[],this.maxAbilityCapacity=0,this.maxCaptureMultiplier=0}this.abilities=[],this.setAbilities(I),this.totalXP=0;for(var S=0;S<this.level;S++)this.totalXP+=this.levelUpXP[S];this.totalXP+=this.XP,this.moveCounter=0,this.isMaxLevel=n>=this.maxLevel,this.highlighted=!1}return t.prototype.setSide=function(t){this.side=t},t.prototype.getSide=function(){return this.side},t.prototype.setType=function(t){this.type=t},t.prototype.getType=function(){return this.type},t.prototype.getInitialSquare=function(){return this.initialSquare},t.prototype.setAttacks=function(t){this.attacks=t},t.prototype.getAttacks=function(){return this.attacks},t.prototype.addAttack=function(t){return-1===this.attacks.indexOf(t)&&(this.attacks.push(t),!0)},t.prototype.removeAttack=function(t){var e=this.getAttackDirections().indexOf(t);return-1!==e&&(this.attacks.splice(e,1),!0)},t.prototype.getAttackDirections=function(){return this.attacks.map((function(t){var e=t[0];return t[1],e}))},t.prototype.getAttackRanges=function(){return this.attacks.map((function(t){return t[0],t[1]}))},t.prototype.rangeOf=function(t){var e=this.getAttackDirections().indexOf(t);return-1===e?0:this.getAttackRanges()[e]},t.prototype.hasAttack=function(t){return-1!==this.getAttackDirections().indexOf(t)},t.prototype.updateAttackRange=function(t,e){var i=this.getAttackDirections().indexOf(t);return-1!==i&&(this.attacks[i][1]=e,!0)},t.prototype.getCanLevelUp=function(){return this.canLevelUp},t.prototype.enableLevelUp=function(){this.canLevelUp=!0},t.prototype.disableLevelUp=function(){this.canLevelUp=!1},t.prototype.setCaptureMultiplier=function(t){this.captureMultiplier=t},t.prototype.increaseCaptureMultiplier=function(t){void 0===t&&(t=.2),this.captureMultiplier+=t},t.prototype.getCaptureMultiplier=function(){return this.captureMultiplier},t.prototype.setAbilityCapacity=function(t){this.abilityCapacity=t},t.prototype.getAbilityCapacity=function(){return this.abilityCapacity},t.prototype.increaseAbilityCapacity=function(t){void 0===t&&(t=1),this.abilityCapacity+=t},t.prototype.decrementAbilityCapacity=function(){return!(this.abilityCapacity<=this.abilities.length||(this.abilityCapacity--,0))},t.prototype.setAbilities=function(t){for(var e=0,i=t;e<i.length;e++){var r=i[e],I=r[0],s=r[1];this.addAbility(I,s)}},t.prototype.getAbilities=function(){return this.abilities},t.prototype.hasAbility=function(t){return-1!==this.getAbilitiesIDs().indexOf(t)},t.prototype.getAbilitiesIDs=function(){return this.abilities.map((function(t){var e=t[0];return t[1],e}))},t.prototype.getAbilitiesNames=function(){return this.abilities.map((function(t){var e=t[0];return t[1],A.Ability[e]}))},t.prototype.getAbilitiesTimesRemaining=function(){return this.abilities.map((function(t){return t[0],t[1]}))},t.prototype.setTimesRemaining=function(t,e){var i=this.getAbilitiesIDs().indexOf(t);return-1!==i&&(this.abilities[i][1]=e,!0)},t.prototype.timesRemaining=function(t){var e=this.getAbilitiesIDs().indexOf(t);return-1===e?-1:this.abilities[e][1]},t.prototype.decreaseTimesRemaining=function(t,e){void 0===e&&(e=!1);var i=this.getAbilitiesIDs().indexOf(t);return-1!==i&&(this.abilities[i][1]--,this.timesRemaining(t)<=0&&this.removeAbility(t),!0)},t.prototype.addAbility=function(t,e){if(void 0===e&&(e=0),this.abilities.length===this.abilityCapacity&&-1===A.default.INSTANT_ABILITIES.indexOf(t))return!1;if(-1!==this.getAbilitiesIDs().indexOf(t)||-1===this.possibleAbilities.indexOf(t))return!1;switch(0===e&&(e=-1===A.default.PASSIVE_ABILITIES.indexOf(t)?A.default.ABILITY_MAX_TIMES_USED:A.default.PASSIVE_ABILITY_MAX_TIMES_USED),t){case A.Ability.INCREASE_CAPACITY:return this.increaseAbilityCapacity(),this.abilityCapacity>=this.maxAbilityCapacity&&this.possibleAbilities.splice(this.possibleAbilities.indexOf(t),1),!0;case A.Ability.INCREASE_CAPTURE_MULTIPLIER:return this.increaseCaptureMultiplier(),this.captureMultiplier>=this.maxCaptureMultiplier&&this.possibleAbilities.splice(this.possibleAbilities.indexOf(t),1),!0;case A.Ability.SWEEPER:this.addAttack([A.Direction.L,1]),this.updateAttackRange(A.Direction.LINE,2),this.updateAttackRange(A.Direction.DIAGONAL,2);break;case A.Ability.LEAPER:this.updateAttackRange(A.Direction.L,2);break;case A.Ability.ON_CAMEL:this.removeAbility(A.Ability.ON_HORSE);break;case A.Ability.ON_HORSE:this.removeAbility(A.Ability.ON_CAMEL)}return this.abilities.push([t,e]),this.possibleAbilities.splice(this.possibleAbilities.indexOf(t),1),!0},t.prototype.removeAbility=function(t){var e=this.getAbilitiesIDs().indexOf(t);if(-1===e)return!1;switch(this.abilities.splice(e,1),t){case A.Ability.SWEEPER:this.removeAttack(A.Direction.L),this.updateAttackRange(A.Direction.LINE,A.default.INFINITE_RANGE),this.updateAttackRange(A.Direction.DIAGONAL,A.default.INFINITE_RANGE);break;case A.Ability.LEAPER:this.updateAttackRange(A.Direction.L,1);break;case A.Ability.CHANGE_COLOR:case A.Ability.SHIELD:return!0}return this.possibleAbilities.push(t),!0},t.prototype.getPossibleAbilitiesIDs=function(){if(this.abilities.length<this.abilityCapacity)return this.possibleAbilities;var t=[A.Ability.NONE];return this.abilityCapacity<this.maxAbilityCapacity&&t.push(A.Ability.INCREASE_CAPACITY),this.captureMultiplier<this.maxCaptureMultiplier&&t.push(A.Ability.INCREASE_CAPTURE_MULTIPLIER),t},t.prototype.getPossibleAbilitiesNames=function(){if(this.abilities.length<this.abilityCapacity)return this.possibleAbilities.map((function(t){return A.Ability[t]}));var t=[A.Ability.NONE];return this.abilityCapacity<this.maxAbilityCapacity&&t.push(A.Ability.INCREASE_CAPACITY),this.captureMultiplier<this.maxCaptureMultiplier&&t.push(A.Ability.INCREASE_CAPTURE_MULTIPLIER),t.map((function(t){return A.Ability[t]}))},t.prototype.setXP=function(t){this.XP=t},t.prototype.getXP=function(){return this.XP},t.prototype.addXP=function(t){return!this.isMaxLevel&&(this.XP+=A.default.PER_MOVE_XP+Math.floor(this.captureMultiplier*t),this.totalXP+=A.default.PER_MOVE_XP+Math.floor(this.captureMultiplier*t),this.levelUpXP[this.level]<=this.XP)},t.prototype.setLevelUpXP=function(t){this.levelUpXP=t},t.prototype.getLevelUpXP=function(){return this.levelUpXP},t.prototype.getTotalXP=function(){return this.totalXP},t.prototype.setLevel=function(t){this.level=t},t.prototype.getLevel=function(){return this.level},t.prototype.increaseLevel=function(){return!(!this.canLevelUp||this.isMaxLevel||(this.XP-=this.levelUpXP[this.level],this.level++,this.level===this.maxLevel&&(this.isMaxLevel=!0),0))},t.prototype.setMoveCounter=function(t){this.moveCounter=t},t.prototype.getMoveCounter=function(){return this.moveCounter},t.prototype.incrementMoveCounter=function(t){void 0===t&&(t=A.Ability.NONE),this.moveCounter++;for(var e=0,i=A.default.PASSIVE_ABILITIES;e<i.length;e++){var r=i[e];this.hasAbility(r)&&this.decreaseTimesRemaining(r,!0)}t!==A.Ability.NONE&&this.decreaseTimesRemaining(t)},t.prototype.reachedMaxLevel=function(){return this.isMaxLevel},t.prototype.getMaxAbilityCapacity=function(){return this.maxAbilityCapacity},t.prototype.getMaxCaptureMultiplier=function(){return this.maxCaptureMultiplier},t.prototype.highlight=function(){this.highlighted=!0},t.prototype.unhighlight=function(){this.highlighted=!1},t.prototype.isHighlighted=function(){return this.highlighted},t}();e.Piece=n},597:(t,e)=>{var i,r,I,s,a;function A(t,e){for(var i=0;i<e.length;i++)if(e[i][0]===t[0]&&e[i][1]===t[1])return i;return-1}function n(t,e){return t.getSide()===I.WHITE&&e.getSide()===I.BLACK||t.getSide()===I.BLACK&&e.getSide()===I.WHITE}function o(t,e){return t.getSide()===I.WHITE&&e.getSide()===I.WHITE||t.getSide()===I.BLACK&&e.getSide()===I.BLACK}function E(t,e){return t.getSide()===e}function _(t,e){return t.getSide()===I.WHITE&&e===I.BLACK||t.getSide()===I.BLACK&&e===I.WHITE}function l(t){return t===I.NONE?I.NONE:t===I.WHITE?I.BLACK:I.WHITE}function u(t){var e=t===t.toLowerCase()?I.BLACK:I.WHITE;for(var i in s)if(s[i]===t.toLowerCase())return[s[i],e];return[s.EMPTY,I.NONE]}function p(t){return t.getType()===s.EMPTY}function L(t){return t.getType()!==s.EMPTY}function T(t){return t.getSide()===I.WHITE}function h(t){return t.getSide()===I.BLACK}function c(t){return t.getType()===s.PAWN}function P(t){return t.getType()===s.BISHOP}function C(t){return t.getType()===s.KNIGHT}function N(t){return t.getType()===s.ROOK}function S(t){return t.getType()===s.QUEEN}function d(t){return t.getType()===s.KING}function f(t){return-1!==t.getAttackDirections().indexOf(r.LINE)}function b(t){return-1!==t.getAttackDirections().indexOf(r.DIAGONAL)}function y(t){return-1!==t.getAttackDirections().indexOf(r.L)}function R(t){return-1!==t.getAttackDirections().indexOf(r.PAWN)}function M(t){return-1!==t.getAttackDirections().indexOf(r.CAMEL)}Object.defineProperty(e,"__esModule",{value:!0}),e.PAWN_MAX_ABILITY_CAPACITY=e.KING_ABILITIES=e.QUEEN_ABILITIES=e.ROOK_ABILITIES=e.KNIGHT_ABILITIES=e.BISHOP_ABILITIES=e.PAWN_ABILITIES=e.PASSIVE_ABILITIES=e.INSTANT_ABILITIES=e.GENERIC_ABILITIES=e.Ability=e.Type=e.Side=e.Direction=e.GameResult=e.PASSIVE_ABILITY_MAX_TIMES_USED=e.ABILITY_MAX_TIMES_USED=e.PER_MOVE_XP=e.KING_MAX_LEVEL=e.QUEEN_MAX_LEVEL=e.ROOK_MAX_LEVEL=e.KNIGHT_MAX_LEVEL=e.BISHOP_MAX_LEVEL=e.PAWN_MAX_LEVEL=e.KING_DEFAULT_ABILITY_CAPACITY=e.QUEEN_DEFAULT_ABILITY_CAPACITY=e.ROOK_DEFAULT_ABILITY_CAPACITY=e.KNIGHT_DEFAULT_ABILITY_CAPACITY=e.BISHOP_DEFAULT_ABILITY_CAPACITY=e.PAWN_DEFAULT_ABILITY_CAPACITY=e.KING_MAX_CAPTURE_MULTIPLIER=e.QUEEN_MAX_CAPTURE_MULTIPLIER=e.ROOK_MAX_CAPTURE_MULTIPLIER=e.KNIGHT_MAX_CAPTURE_MULTIPLIER=e.BISHOP_MAX_CAPTURE_MULTIPLIER=e.PAWN_MAX_CAPTURE_MULTIPLIER=e.KING_CAPTURE_MULTIPLIER=e.QUEEN_CAPTURE_MULTIPLIER=e.ROOK_CAPTURE_MULTIPLIER=e.KNIGHT_CAPTURE_MULTIPLIER=e.BISHOP_CAPTURE_MULTIPLIER=e.PAWN_CAPTURE_MULTIPLIER=e.KING_LEVELUP_XP=e.QUEEN_LEVELUP_XP=e.ROOK_LEVELUP_XP=e.KNIGHT_LEVELUP_XP=e.BISHOP_LEVELUP_XP=e.PAWN_LEVELUP_XP=e.INFINITE_TIME=e.INFINITE_RANGE=void 0,e.hasCamelAttack=e.hasPawnAttack=e.hasKnightAttack=e.hasDiagonalAttack=e.hasLineAttack=e.isKing=e.isQueen=e.isRook=e.isKnight=e.isBishop=e.isPawn=e.isBlack=e.isWhite=e.isNotEmpty=e.isEmpty=e.stringToPiece=e.oppositeColor=e.oppositeSide=e.sameSide=e.sameSidePiece=e.oppositeSidePiece=e.coordinateInList=e.KING_MAX_ABILITY_CAPACITY=e.QUEEN_MAX_ABILITY_CAPACITY=e.ROOK_MAX_ABILITY_CAPACITY=e.KNIGHT_MAX_ABILITY_CAPACITY=e.BISHOP_MAX_ABILITY_CAPACITY=void 0,e.INFINITE_RANGE=65535,e.INFINITE_TIME=-1,e.PAWN_LEVELUP_XP=[10,12,15,17,19,20,22,24,25,27,29,30,32,35,40,45,50,55,60,66,72,80],e.BISHOP_LEVELUP_XP=[10,12,15,17,19,20,22,24,25,27,29,30,32,35,40,45,50,55,60,66,72,80],e.KNIGHT_LEVELUP_XP=[10,12,15,17,19,20,22,24,25,27,29,30,32,35,40,45,50,55,60,66,72,80],e.ROOK_LEVELUP_XP=[10,12,15,17,19,20,22,24,25,27,29,30,32,35,40,45,50,55,60,66,72,80],e.QUEEN_LEVELUP_XP=[10,12,15,17,19,20,22,24,25,27,29,30,32,35,40,45,50,55,60,66,72,80],e.KING_LEVELUP_XP=[10,12,15,17,19,20,22,24,25,27,29,30,32,35,40,45,50,55,60,66,72,80],e.PAWN_CAPTURE_MULTIPLIER=.7,e.BISHOP_CAPTURE_MULTIPLIER=.4,e.KNIGHT_CAPTURE_MULTIPLIER=.5,e.ROOK_CAPTURE_MULTIPLIER=.3,e.QUEEN_CAPTURE_MULTIPLIER=.2,e.KING_CAPTURE_MULTIPLIER=.6,e.PAWN_MAX_CAPTURE_MULTIPLIER=2,e.BISHOP_MAX_CAPTURE_MULTIPLIER=1.5,e.KNIGHT_MAX_CAPTURE_MULTIPLIER=1.5,e.ROOK_MAX_CAPTURE_MULTIPLIER=1.3,e.QUEEN_MAX_CAPTURE_MULTIPLIER=1,e.KING_MAX_CAPTURE_MULTIPLIER=1.7,e.PAWN_DEFAULT_ABILITY_CAPACITY=2,e.BISHOP_DEFAULT_ABILITY_CAPACITY=2,e.KNIGHT_DEFAULT_ABILITY_CAPACITY=1,e.ROOK_DEFAULT_ABILITY_CAPACITY=1,e.QUEEN_DEFAULT_ABILITY_CAPACITY=1,e.KING_DEFAULT_ABILITY_CAPACITY=1,e.PAWN_MAX_LEVEL=10,e.BISHOP_MAX_LEVEL=10,e.KNIGHT_MAX_LEVEL=10,e.ROOK_MAX_LEVEL=10,e.QUEEN_MAX_LEVEL=10,e.KING_MAX_LEVEL=10,e.PER_MOVE_XP=5,e.ABILITY_MAX_TIMES_USED=5,e.PASSIVE_ABILITY_MAX_TIMES_USED=5,function(t){t[t.BLACK_WIN=-1]="BLACK_WIN",t[t.DRAW=0]="DRAW",t[t.WHITE_WIN=1]="WHITE_WIN",t[t.IN_PROGRESS=2]="IN_PROGRESS"}(i=e.GameResult||(e.GameResult={})),function(t){t.LINE="LINE",t.DIAGONAL="DIAGONAL",t.L="L",t.PAWN="PAWN",t.CAMEL="CAMEL",t.CASTLING="CASTLING"}(r=e.Direction||(e.Direction={})),function(t){t.WHITE="WHITE",t.BLACK="BLACK",t.NONE="NONE"}(I=e.Side||(e.Side={})),function(t){t.EMPTY=".",t.PAWN="p",t.BISHOP="b",t.KNIGHT="n",t.ROOK="r",t.QUEEN="q",t.KING="k"}(s=e.Type||(e.Type={})),function(t){t[t.NONE=0]="NONE",t[t.INCREASE_CAPACITY=101]="INCREASE_CAPACITY",t[t.INCREASE_CAPTURE_MULTIPLIER=102]="INCREASE_CAPTURE_MULTIPLIER",t[t.SHIELD=103]="SHIELD",t[t.SCOUT=200]="SCOUT",t[t.QUANTUM_TUNNELING=203]="QUANTUM_TUNNELING",t[t.BACKWARDS=204]="BACKWARDS",t[t.SMOLDERING=301]="SMOLDERING",t[t.CAMEL=302]="CAMEL",t[t.LEAPER=303]="LEAPER",t[t.CHANGE_COLOR=402]="CHANGE_COLOR",t[t.ARCHBISHOP=403]="ARCHBISHOP",t[t.HAS_PAWN=501]="HAS_PAWN",t[t.CHANCELLOR=502]="CHANCELLOR",t[t.SWEEPER=601]="SWEEPER",t[t.BOOST_ADJACENT_PIECES=602]="BOOST_ADJACENT_PIECES",t[t.SKIP=700]="SKIP",t[t.ON_HORSE=702]="ON_HORSE",t[t.ON_CAMEL=705]="ON_CAMEL"}(a=e.Ability||(e.Ability={})),e.GENERIC_ABILITIES=[a.NONE,a.INCREASE_CAPACITY,a.INCREASE_CAPTURE_MULTIPLIER],e.INSTANT_ABILITIES=[a.NONE,a.INCREASE_CAPACITY,a.INCREASE_CAPTURE_MULTIPLIER],e.PASSIVE_ABILITIES=[a.SMOLDERING,a.SWEEPER,a.LEAPER,a.BOOST_ADJACENT_PIECES],e.PAWN_ABILITIES=[a.SCOUT,a.QUANTUM_TUNNELING,a.BACKWARDS],e.BISHOP_ABILITIES=[a.CHANGE_COLOR,a.ARCHBISHOP],e.KNIGHT_ABILITIES=[a.SMOLDERING,a.CAMEL,a.LEAPER],e.ROOK_ABILITIES=[a.HAS_PAWN,a.CHANCELLOR],e.QUEEN_ABILITIES=[a.SWEEPER,a.BOOST_ADJACENT_PIECES],e.KING_ABILITIES=[a.SKIP,a.ON_HORSE,a.ON_CAMEL],e.PAWN_MAX_ABILITY_CAPACITY=e.PAWN_ABILITIES.length+e.GENERIC_ABILITIES.length-e.INSTANT_ABILITIES.length,e.BISHOP_MAX_ABILITY_CAPACITY=e.BISHOP_ABILITIES.length+e.GENERIC_ABILITIES.length-e.INSTANT_ABILITIES.length,e.KNIGHT_MAX_ABILITY_CAPACITY=e.KNIGHT_ABILITIES.length+e.GENERIC_ABILITIES.length-e.INSTANT_ABILITIES.length,e.ROOK_MAX_ABILITY_CAPACITY=e.ROOK_ABILITIES.length+e.GENERIC_ABILITIES.length-e.INSTANT_ABILITIES.length,e.QUEEN_MAX_ABILITY_CAPACITY=e.QUEEN_ABILITIES.length+e.GENERIC_ABILITIES.length-e.INSTANT_ABILITIES.length,e.KING_MAX_ABILITY_CAPACITY=e.KING_ABILITIES.length+e.GENERIC_ABILITIES.length-e.INSTANT_ABILITIES.length,e.coordinateInList=A,e.oppositeSidePiece=n,e.sameSidePiece=o,e.sameSide=E,e.oppositeSide=_,e.oppositeColor=l,e.stringToPiece=u,e.isEmpty=p,e.isNotEmpty=L,e.isWhite=T,e.isBlack=h,e.isPawn=c,e.isBishop=P,e.isKnight=C,e.isRook=N,e.isQueen=S,e.isKing=d,e.hasLineAttack=f,e.hasDiagonalAttack=b,e.hasKnightAttack=y,e.hasPawnAttack=R,e.hasCamelAttack=M,e.default={INFINITE_RANGE:e.INFINITE_RANGE,INFINITE_TIME:e.INFINITE_TIME,PAWN_LEVELUP_XP:e.PAWN_LEVELUP_XP,BISHOP_LEVELUP_XP:e.BISHOP_LEVELUP_XP,KNIGHT_LEVELUP_XP:e.KNIGHT_LEVELUP_XP,ROOK_LEVELUP_XP:e.ROOK_LEVELUP_XP,QUEEN_LEVELUP_XP:e.QUEEN_LEVELUP_XP,KING_LEVELUP_XP:e.KING_LEVELUP_XP,PAWN_CAPTURE_MULTIPLIER:e.PAWN_CAPTURE_MULTIPLIER,BISHOP_CAPTURE_MULTIPLIER:e.BISHOP_CAPTURE_MULTIPLIER,KNIGHT_CAPTURE_MULTIPLIER:e.KNIGHT_CAPTURE_MULTIPLIER,ROOK_CAPTURE_MULTIPLIER:e.ROOK_CAPTURE_MULTIPLIER,QUEEN_CAPTURE_MULTIPLIER:e.QUEEN_CAPTURE_MULTIPLIER,KING_CAPTURE_MULTIPLIER:e.KING_CAPTURE_MULTIPLIER,PAWN_MAX_CAPTURE_MULTIPLIER:e.PAWN_MAX_CAPTURE_MULTIPLIER,BISHOP_MAX_CAPTURE_MULTIPLIER:e.BISHOP_MAX_CAPTURE_MULTIPLIER,KNIGHT_MAX_CAPTURE_MULTIPLIER:e.KNIGHT_MAX_CAPTURE_MULTIPLIER,ROOK_MAX_CAPTURE_MULTIPLIER:e.ROOK_MAX_CAPTURE_MULTIPLIER,QUEEN_MAX_CAPTURE_MULTIPLIER:e.QUEEN_MAX_CAPTURE_MULTIPLIER,KING_MAX_CAPTURE_MULTIPLIER:e.KING_MAX_CAPTURE_MULTIPLIER,PAWN_DEFAULT_ABILITY_CAPACITY:e.PAWN_DEFAULT_ABILITY_CAPACITY,BISHOP_DEFAULT_ABILITY_CAPACITY:e.BISHOP_DEFAULT_ABILITY_CAPACITY,KNIGHT_DEFAULT_ABILITY_CAPACITY:e.KNIGHT_DEFAULT_ABILITY_CAPACITY,ROOK_DEFAULT_ABILITY_CAPACITY:e.ROOK_DEFAULT_ABILITY_CAPACITY,QUEEN_DEFAULT_ABILITY_CAPACITY:e.QUEEN_DEFAULT_ABILITY_CAPACITY,KING_DEFAULT_ABILITY_CAPACITY:e.KING_DEFAULT_ABILITY_CAPACITY,PAWN_MAX_LEVEL:e.PAWN_MAX_LEVEL,BISHOP_MAX_LEVEL:e.BISHOP_MAX_LEVEL,KNIGHT_MAX_LEVEL:e.KNIGHT_MAX_LEVEL,ROOK_MAX_LEVEL:e.ROOK_MAX_LEVEL,QUEEN_MAX_LEVEL:e.QUEEN_MAX_LEVEL,KING_MAX_LEVEL:e.KING_MAX_LEVEL,PER_MOVE_XP:e.PER_MOVE_XP,ABILITY_MAX_TIMES_USED:e.ABILITY_MAX_TIMES_USED,PASSIVE_ABILITY_MAX_TIMES_USED:e.PASSIVE_ABILITY_MAX_TIMES_USED,GameResult:i,Direction:r,Side:I,Type:s,Ability:a,GENERIC_ABILITIES:e.GENERIC_ABILITIES,INSTANT_ABILITIES:e.INSTANT_ABILITIES,PASSIVE_ABILITIES:e.PASSIVE_ABILITIES,PAWN_ABILITIES:e.PAWN_ABILITIES,BISHOP_ABILITIES:e.BISHOP_ABILITIES,KNIGHT_ABILITIES:e.KNIGHT_ABILITIES,ROOK_ABILITIES:e.ROOK_ABILITIES,QUEEN_ABILITIES:e.QUEEN_ABILITIES,KING_ABILITIES:e.KING_ABILITIES,PAWN_MAX_ABILITY_CAPACITY:e.PAWN_MAX_ABILITY_CAPACITY,BISHOP_MAX_ABILITY_CAPACITY:e.BISHOP_MAX_ABILITY_CAPACITY,KNIGHT_MAX_ABILITY_CAPACITY:e.KNIGHT_MAX_ABILITY_CAPACITY,ROOK_MAX_ABILITY_CAPACITY:e.ROOK_MAX_ABILITY_CAPACITY,QUEEN_MAX_ABILITY_CAPACITY:e.QUEEN_MAX_ABILITY_CAPACITY,KING_MAX_ABILITY_CAPACITY:e.KING_MAX_ABILITY_CAPACITY,coordinateInList:A,oppositeSidePiece:n,sameSidePiece:o,sameSide:E,oppositeSide:_,oppositeColor:l,stringToPiece:u,isEmpty:p,isNotEmpty:L,isWhite:T,isBlack:h,isPawn:c,isBishop:P,isKnight:C,isRook:N,isQueen:S,isKing:d,hasLineAttack:f,hasDiagonalAttack:b,hasKnightAttack:y,hasPawnAttack:R,hasCamelAttack:M}}},e={};function i(r){var I=e[r];if(void 0!==I)return I.exports;var s=e[r]={exports:{}};return t[r].call(s.exports,s,s.exports,i),s.exports}var r={};(()=>{var t=r;Object.defineProperty(t,"__esModule",{value:!0}),t.Game=void 0;var e=i(597),I=i(306);t.Game=function(){function t(i,r,s){this.gameId=t.gameIdCounter,t.gameIdCounter++,this.whiteId=i,this.blackId=r,this.gameState=new I.GameState(s,0,e.INFINITE_TIME,e.INFINITE_TIME),this.gameResult=e.GameResult.IN_PROGRESS}return t.prototype.getWhiteId=function(){return this.whiteId},t.prototype.getBlackId=function(){return this.blackId},t.prototype.getGameState=function(){return this.gameState},t.gameIdCounter=1e3,t}()})(),GameBundle=r})();