(async () => {
  let domains = ["https://webglmath.github.io/"]
  let games = await fetch("./games.json")
  games = await games.json()
  games = games.filter(game => game.domain == 1 || game.flash === true)
  document.getElementById("count").textContent = games.length
  games.forEach(ee => {
    let e = ee
    let el = document.createElement("button")
    el.textContent = e.title
    el.onclick = () => {
      setTimeout(() => {
        let win = window.open("about:blank")

        win.document.write(`
        <title>${e.title}</title>
        <style>
          body{
            overflow:hidden;
          }
          *{
            margin:0;
          }
        </style>
        <script src="https://cdn.jsdelivr.net/gh/crafterboy27-school/searchy/butil.js"></script>
        <iframe src="${domains[e.domain - 1] + e.slug}" style="width:100vw;height:100vh;">
        `)
      }, 250)

      // document.getElementById("game").src = domain + e.slug
    }

    document.getElementById("games").appendChild(el)
  })

  setInterval(() => {
    let search = document.getElementById("search").value
    Array.from(document.querySelectorAll("button")).forEach((el) => {
      if (/^\s*$/.test(search)) {
        el.style.display = "inline-block"
        return
      }
      el.style.display = el.textContent.toLowerCase().includes(search.toLowerCase()) ? "inline-block" : "none"
    })
  }, 20)
})()
