// ข้อ4.1
async function getAllUser() {
    //TODO
    // 1. ให้ใช้ Try Catch
    // 2. เรียกใช้ฟังก์ชัน ApiDelay()
    // 3. หากเรียกฟังก์ชันสำเร็จให้ (status: 200) ให้นำ message แสดงในกล่องข้อความ
    // 4. หากเรียกฟังก์ชันไม่สำเร็จ (message: "SERVER ERROR") ให้นำ message แสดงในกล่องข้อความ
    try {
        var name = await ApiDelay()
        if (name.status === 200) {
            document.getElementById('TA').innerHTML = name.message
            console.log(name)
        }
    } catch (error) {
        document.getElementById('TA').innerHTML = error
    }

}

// ข้อ 4.2
function checkAuth(password) {
    return new Promise((resolve, reject) => {
        if (password == "In4matioN") {
            resolve("รหัสผ่านถูกต้อง")
        } else {
            reject("รหัสผ่านไม่ถูกต้อง กรุณาลองอีกครั้ง")
        }
    })

}

async function fetchData(password) {
    try {
        let result = await checkAuth(password)
        alert(result)




        var image = await fetch('https://api.thecatapi.com/v1/images/search')
        var image2 = await image.json()
        console.log(image2[0].url)
        cat.src = image2[0].url


    } catch (error) {
        alert(error)
    }
}


/*
    Function สำหรับ TA กับ อาจารย์
    นักศึกษากรุณา อย่าแก้ไข
*/

async function ApiDelay() {
    return new Promise(resolve => {
        setTimeout(() => resolve(_fakeAPI()), 2000)
    })
}

async function _fakeAPI() {
    const user = ["Bank", "Mac", "Takai", "Fluke"]

    if (Math.floor(Math.random() * 3) === 1) {
        throw new Error("SERVER ERROR")
    }

    return {
        status: 200,
        message: user[Math.floor(Math.random() * 4)]
    }
}
