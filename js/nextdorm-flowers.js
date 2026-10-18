// CircleSpaces / NextDorm — Flowers leaderboards: renders podium + rows from
// window.NEXT_DORM_FLOWERS_DATA (see js/flowers-data.js) and scales both
// boards to fit their row, mirroring the phones-alignment approach elsewhere
// on the site: transform:scale() + an explicit-size wrapper, not CSS `zoom`.
(function () {
  "use strict";

  var AVATAR_COLORS = ["#7B2A31", "#785028", "#5F8752", "#C98A1E", "#94434A", "#4E6E43", "#A0663A"];
  var BOARD_WIDTH = 340;
  var ROW_GAP = 24;
  var FIT_WIDTH = 680;
  var STAGGER = 120;

  function initials(name) {
    var words = name.replace(/[^A-Za-z ]/g, " ").split(/\s+/).filter(Boolean);
    return words.slice(0, 2).map(function (w) { return w[0].toUpperCase(); }).join("");
  }

  function fmt(n) {
    return n.toLocaleString("en-US");
  }

  function iconFor(rank) {
    if (rank === 1) return "/assets/nextdorm-flowers/icon-v3.png";
    if (rank <= 6) return "/assets/nextdorm-flowers/icon-v2.png";
    return "/assets/nextdorm-flowers/icon-v1.png";
  }

  function el(tag, className, html) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (html != null) node.innerHTML = html;
    return node;
  }

  function buildPodiumStep(entry, rank, colorIndex, isDorm) {
    var step = el("div", "nd-podium-step is-rank-" + rank);

    var avatarWrap = el("div", "nd-podium-avatar-wrap");
    if (rank === 1) avatarWrap.appendChild(el("span", "nd-podium-crown", "♛"));
    var avatar = el("span", "nd-podium-avatar", initials(entry.name));
    avatar.style.background = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length];
    avatarWrap.appendChild(avatar);
    avatarWrap.appendChild(el("span", "nd-podium-badge", String(rank)));
    step.appendChild(avatarWrap);

    var card = el("div", "nd-podium-card");
    if (!isDorm) card.appendChild(el("span", "nd-podium-name", entry.name));
    var chip = el("div", "nd-podium-chip");
    chip.appendChild(el("span", null, isDorm ? entry.name : entry.title));
    card.appendChild(chip);
    card.appendChild(el("span", "nd-podium-count", fmt(entry.count)));
    var icon = el("span", "nd-podium-icon");
    icon.setAttribute("aria-hidden", "true");
    icon.style.backgroundImage = 'url("' + iconFor(rank) + '")';
    card.appendChild(icon);
    step.appendChild(card);

    return step;
  }

  function buildRow(entry, rank, colorIndex, isDorm) {
    var row = el("div", "nd-row");

    var rankEl = el("span", "nd-row-rank", String(rank));
    row.appendChild(rankEl);

    var avatar = el("span", "nd-row-avatar", initials(entry.name));
    avatar.style.background = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length];
    row.appendChild(avatar);

    var info = el("div", "nd-row-info");
    if (!isDorm) info.appendChild(el("span", "nd-row-name", entry.name));
    var line = el("div", "nd-row-line");
    line.appendChild(el("span", "nd-row-chip", isDorm ? entry.name : entry.title));
    var icon = el("span", "nd-row-icon");
    icon.setAttribute("aria-hidden", "true");
    icon.style.backgroundImage = 'url("' + iconFor(rank) + '")';
    line.appendChild(icon);
    info.appendChild(line);
    row.appendChild(info);

    var counts = el("div", "nd-row-counts");
    counts.appendChild(el("span", "nd-row-count", fmt(entry.count)));
    counts.appendChild(el("span", "nd-row-unit", "flowers"));
    row.appendChild(counts);

    return row;
  }

  function renderBoard(board, list, isDorm) {
    var podiumEl = board.querySelector("[data-flowers-podium]");
    var rowsEl = board.querySelector("[data-flowers-rows]");
    if (!podiumEl || !rowsEl) return;

    var colorOffset = isDorm ? 3 : 0;
    var order = [2, 1, 3];
    order.forEach(function (rank) {
      var entry = list[rank - 1];
      if (!entry) return;
      podiumEl.appendChild(buildPodiumStep(entry, rank, rank - 1 + colorOffset, isDorm));
    });

    list.slice(3).forEach(function (entry, i) {
      var rank = i + 4;
      rowsEl.appendChild(buildRow(entry, rank, rank - 1 + colorOffset, isDorm));
    });
  }

  function fitBoards(container) {
    var scale = container.clientWidth > 0 ? Math.min(1, (container.clientWidth - ROW_GAP) / FIT_WIDTH) : 1;
    var wraps = container.querySelectorAll("[data-flowers-wrap]");
    wraps.forEach(function (wrap) {
      var board = wrap.querySelector(".nd-board");
      if (!board) return;
      board.style.transform = "scale(" + scale + ")";
      wrap.style.width = (BOARD_WIDTH * scale) + "px";
      wrap.style.height = (board.offsetHeight * scale) + "px";
      if (wrap.hasAttribute("data-flowers-stagger")) {
        wrap.style.marginTop = (STAGGER * scale) + "px";
      }
    });
  }

  function init() {
    var section = document.querySelector("[data-flowers-section]");
    var data = window.NEXT_DORM_FLOWERS_DATA;
    if (!section || !data) return;

    var boardsEl = section.querySelector("[data-flowers-boards]");
    var peopleBoard = section.querySelector('[data-flowers-board="people"]');
    var dormsBoard = section.querySelector('[data-flowers-board="dorms"]');
    if (!boardsEl || !peopleBoard || !dormsBoard) return;

    renderBoard(peopleBoard, data.people || [], false);
    renderBoard(dormsBoard, data.dorms || [], true);

    var fit = function () { fitBoards(boardsEl); };
    if ("ResizeObserver" in window) {
      new ResizeObserver(fit).observe(boardsEl);
    } else {
      window.addEventListener("resize", fit);
    }
    window.addEventListener("load", fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    fit();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
