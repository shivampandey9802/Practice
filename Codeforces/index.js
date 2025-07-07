let input = document.getElementsByClassName("handle")[0]
let btn = document.getElementById("btn")
let userInfo = document.getElementsByClassName("userInfo")
let rank = document.getElementsByClassName("rank")[0]
let rating = document.getElementsByClassName("rating")[0]
let img = document.getElementsByTagName("img")[0]
let suggestProblem = document.getElementById("suggest-problem")
let item = document.getElementsByClassName("item")
let checkbox = document.getElementsByClassName("checkbox")
let problemStatement = document.getElementsByClassName("problem-statement");
let problemRating = document.getElementsByClassName("problem-rating")
let findBtn = document.getElementById("find-btn")



const userStatusUrl = `https://codeforces.com/api/user.status?handle=`;
const infoUrl = `https://codeforces.com/api/user.info?handles=`;
const problemUrl = `https://codeforces.com/api/problemset.problems?`
// const problemLink = `https://codeforces.com/problemset/problem/2121/A`
// _Raunak_

let set = new Set()
let handle
let userStatus = null
let infoData
async function fetchData(url) {
    url += handle
    let response = await fetch(url)
    let data = await response.json()
    return data
}

btn.addEventListener("click", async (e) => {
    handle = input.value.trim()
    try {
        infoData = await fetchData(infoUrl)
        localStorage.setItem("userSrc" , infoData.result[0].avatar)
        img.src = infoData.result[0].avatar

        rank.textContent = `Current rank: ` + infoData.result[0].rank
        localStorage.setItem("currentRank" , `Current rank: ` + infoData.result[0].rank)

        rating.textContent = `Current rating: ` + infoData.result[0].rating
        localStorage.setItem("currentRating" , `Current rating: ` + infoData.result[0].rating)

        userStatus = await fetchData(userStatusUrl)
        // console.log(userStatus.result[0].problem.name)
        console.log(userStatus.result[0].verdict)
        for (let i = 0; i < userStatus.result.length; i++) {
            let problemName = userStatus.result[i].problem.name
            if (userStatus.result[i].verdict === "OK") {
                set.add(problemName)
            }
        }
        call(set)
    } catch (err) {
        console.log(err)
    }
})

function call(set) {
    findBtn.addEventListener("click", async () => {
        let problems = await fetchData(problemUrl)
        // console.log(problems.result.problems[0].name)
        console.log(problems.result.problems[0].rating)
        // console.log(problems)
        let s = new Set()
        let i = 0
        for (let j = 0; j < problems.result.problems.length && i < 4; j++) {
            let random = Math.floor(Math.random() * problems.result.problems.length)
            let name = problems.result.problems[random].name;
            let r = problems.result.problems[random].rating
            if (!set.has(name) && !s.has(name) && r) {
                s.add(name)
                problemRating[i].textContent = problems.result.problems[random].rating
                let contestId = problems.result.problems[random].contestId;
                let index = problems.result.problems[random].index;
                problemStatement[i].textContent = "";
                let a = document.createElement("a")
                a.href = `https://codeforces.com/problemset/problem/${contestId}/${index}`
                a.textContent = name;
                a.target = "_blank";
                problemStatement[i].appendChild(a)
                i++;
                // console.log(problems.result.problems[i].name)
            }
        }
    })
}

window.onload = ()=>{
    let source = localStorage.getItem("userSrc")
    let currentRank = localStorage.getItem("currentRank")
    let currentRating = localStorage.getItem("currentRating")
    if(source) {
        img.src = source
        rank.textContent = currentRank
        rating.textContent = currentRating
    }
}