// ข้อ 3.1
function getDogDemo(url) {
  // hint: เรียกใช้ getAPI() โดยดึงข้อมูลจาก url = https://dog.ceo/api/breeds/image/random
  // ลอง console.log() ดูว่าข้อมูลที่ได้มาเป็นอย่างไร

  var time = 10
  let promise = new Promise((resolve, reject) => {
    getAPI('https://dog.ceo/api/breeds/image/random', resolve, reject)
  })


  setTimeout(() => {
    promise.then((result) => {
      document.getElementById('dogImg').src = `${result.message}`
    })

  }, 1000)

  var myVar = setInterval(myTimer, 100);
  function myTimer() {
    document.getElementById('dogTime').innerHTML = time
    // console.log(time)
    if (time == 0) {
      clearInterval(myVar)
    }
    time--
  }

}


// ข้อ 3.2
function Rainbow() {
  //TODO
  // 1. ในกรณีที่ status = 'success' ให้แสดงตัวเลขเป็นสีตามที่กำหนดในแต่ละ STATE
  // 2. ให้แสดงชื่อ STATE (STATE 1 หรือ STATE 2 หรือ STATE 3) ในกล่องข้อความเมื่อเกิด Error
  // 3. เปลี่ยนสีข้อความเป็นสีแดงเมื่อเกิด Error (class = 'has-text-error')

  const rainbow = document.getElementById("rainbow")

  setTimeout(() => {
    // STATE 1 color = 'has-text-primary'
    if (getResult().status == 'success') {
      rainbow.innerHTML = `${getResult().text}`
      rainbow.classList.add('has-text-primary')
    } else {
      rainbow.classList.add('has-text-danger')
      rainbow.innerHTML = `STATE 1`
    }
    setTimeout(() => {
      // STATE 2 color = 'has-text-success'
      rainbow.className = "";
      if (getResult().status == 'success') {
        rainbow.innerHTML = `${getResult().text}`
        rainbow.classList.add('has-text-success')
      } else {
        rainbow.classList.add('has-text-danger')
        rainbow.innerHTML = `STATE 2`
      }
      setTimeout(() => {
        // STATE 3 color = 'has-text-success'
        rainbow.className = "";
        if (getResult().status == 'success') {
          rainbow.innerHTML = `${getResult().text}`
          rainbow.classList.add('has-text-success')
        } else {
          rainbow.classList.add('has-text-danger')
          rainbow.innerHTML = `STATE 3`
        }
      }, 2000)

    }, 2000)

  }, 2000)





}

function getResult() {
  const num = Math.floor(Math.random() * 10)
  console.log(num)
  if (num > 5) {
    return {
      'status': 'success',
      'text': num
    }
  } else {
    return {
      'status': 'error',
      'text': num
    }
  }
}

// ข้อ 3.3
function evenNumber(num) {
  // hint : ทำการสร้าง promise และเรียกใช้
  var num = document.getElementById('number').value
  var ans = document.getElementById('result')
  console.log(num)

  let checkEventNumber = new Promise(
    function (resolve, reject) {
      if (num % 2 == 0) {
        ans.innerHTML = `success : ${num} is an even number`
        resolve(ans)
      } else {
        ans.innerHTML = `Error  : ${num} is not an even number`
        reject(ans)
      }
    }
  )
  checkEventNumber.then((result) => {
    result
  }).catch((error) => {
    error
  })


}

// ข้อ 3.4
function task(id) {
  const delay = parseInt(Math.random() * 1000)
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      if (delay < 500) {
        resolve(delay)
      } else {
        reject(delay)
      }
    }, delay)
  })
}


function tester() {
  console.log(task(1))
  // hint : task(1).then().catch() ..... task(4)...
  // ต้องเรียก function task 4 ครั้ง เปลี่ยน id ไปเรื่อยๆ

  task(1).then((delay) => {
    console.log(`task 1: ${delay}ms ... PASS!`)
  }).catch((error) => {
    console.log(`task 1: ${error}ms ... NOTPASS!`)
  })


  // setTimeout(() => {
  task(2).then((delay) => {
    console.log(`task 2: ${delay}ms ... PASS!`)
  }).catch((error) => {
    console.log(`task 2: ${error}ms ... NOTPASS!`)
  })
  // }, 500)


  // setTimeout(() => {
  task(3).then((delay) => {
    console.log(`task 3: ${delay}ms ... PASS!`)
  }).catch((error) => {
    console.log(`task 3: ${error}ms ... NOTPASS!`)
  })
  // }, 500)


  // setTimeout(() => {
  task(4).then((delay) => {
    console.log(`task 4: ${delay}ms ... PASS!`)
  }).catch((error) => {
    console.log(`task 4: ${error}ms ... NOTPASS!`)
  })
  // }, 500)


}

// ข้อ 3.5
// hint : เรียก getAPI() ที่ url = https://api.thecatapi.com/v1/images/search
// อย่าลืม console.log() ดูข้อมูลที่ได้ด้วยว่ามีโครงสร้างแบบใด
function checkAuth(password) {
  var checkPromise = new Promise((resolve, reject) => {
    if (password == "Cisco") {
      resolve("รหัสผ่านถูกต้อง")
    } else {
      reject("รหัสผ่านไม่ถูกต้อง กรุณาลองอีกครั้ง")
    }
  })
  checkPromise.then((result) => {
    alert(result)
    getAPI('https://api.thecatapi.com/v1/images/search', success, error)
  }).catch((error) => {
    alert(error)
  })

}
function success(agr) {
  console.log(agr)
  document.getElementById('cat').src = agr[0].url

}
function error(error) {

}

function fetchData(password) {
  checkAuth(password)

}

// GET API
function getAPI(url, success, error) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const res = JSON.parse(this.response);
      // console.log(res)
      success(res);
    } else if (this.readyState == 4) {
      const res = JSON.parse(this.response);
      error(res);
    }
  };
  xhttp.open("GET", url, true);
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.send();
}
