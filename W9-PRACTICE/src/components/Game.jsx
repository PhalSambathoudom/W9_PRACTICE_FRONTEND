import React, { useState } from "react";
function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function createLogAttack(isPlayer, damage) {
  return { isPlayer, isDamage: true, text: ` takes ${damage} damages` };
}
function createLogHeal(healing) {
  return { isPlayer: true, isDamage: false, text: ` heal ${healing} life points` };
}
const Health = 100;
function Game() {
  const [playerHP, setPlayerHP] = useState(Health);
  const [monsterHP, setMonsterHP] = useState(Health);
  const [logs, setLogs] = useState([]);
  const [round, setRound] = useState(0);
  const specialAvailable = round > 0 && round % 3 === 0;
  function addLogs(newLogs) {
    setLogs((prev) => [...newLogs.reverse(), ...prev]);
  }
  function attackHandler() {
    const dmg = getRandomValue(5, 12);
    const monsterDmg = getRandomValue(8, 15);
    setMonsterHP((prev) => Math.max(prev - dmg, 0));
    setPlayerHP((prev) => Math.max(prev - monsterDmg, 0));
    addLogs([createLogAttack(true, dmg), createLogAttack(false, monsterDmg)]);
    setRound((prev) => prev + 1);
  }
  function specialHandler() {
    const dmg = getRandomValue(10, 20);
    const monsterDmg = getRandomValue(8, 15);
    setMonsterHP((prev) => Math.max(prev - dmg, 0));
    setPlayerHP((prev) => Math.max(prev - monsterDmg, 0));
    addLogs([createLogAttack(true, dmg), createLogAttack(false, monsterDmg)]);
    setRound((prev) => prev + 1);
  }
  function healHandler() {
    const heal = getRandomValue(8, 15);
    const monsterDmg = getRandomValue(8, 15);
    setPlayerHP((prev) => Math.min(Math.max(prev + heal - monsterDmg, 0), Health));
    addLogs([createLogHeal(heal), createLogAttack(false, monsterDmg)]);
    setRound((prev) => prev + 1);
  }
  function surrenderHandler() {
    setPlayerHP(0);
  }
  function restartHandler() {
    setPlayerHP(Health);
    setMonsterHP(Health);
    setLogs([]);
    setRound(0);
  }
  function checkWinner() {
    if (playerHP <= 0 && monsterHP <= 0) return "Draw!";
    if (playerHP <= 0) return "Monster Wins!";
    if (monsterHP <= 0) return "You Win!";
    return null;
  }
  function renderLogs() {
    return logs.map((log, index) => (
      <li key={index}>
        <span className={log.isPlayer ? "log--player" : "log--monster"}>
          {log.isPlayer ? "Player" : "Monster"}
        </span>
        <span className={log.isDamage ? "log--damage" : "log--heal"}>
          {log.text}
        </span>
      </li>
    ));
  }
  function renderHealthBar(value) {
    return (
      <div className="healthbar">
        <div className="healthbar__value" style={{ width: `${value}%` }}></div>
      </div>
    );
  }
  const winner = checkWinner();
  return (
    <>
      <section className="container">
        <h2>Monster Health</h2>
        {renderHealthBar(monsterHP)}
      </section>
      <section className="container">
        <h2>Your Health</h2>
        {renderHealthBar(playerHP)}
      </section>
      {!winner && (
        <section id="controls">
          <button onClick={attackHandler}>ATTACK</button>
          <button onClick={specialHandler} disabled={!specialAvailable}>SPECIAL</button>
          <button onClick={healHandler}>HEAL</button>
          <button onClick={surrenderHandler}>KILL YOURSELF</button>
        </section>
      )}
      {winner && (
        <section className="container">
          <h2>Game Over</h2>
          <h3>{winner}</h3>
          <button onClick={restartHandler}>Start New Game</button>
        </section>
      )}
      <section id="log" className="container">
        <h2>Battle Log</h2>
        <ul>{renderLogs()}</ul>
      </section>
    </>
  );
}
export default Game;
