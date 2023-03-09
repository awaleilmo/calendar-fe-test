import React, {useEffect, useState} from 'react'
import data from "bootstrap/js/src/dom/data";

const Home = () => {
    const bodyCalendar = {
        minHeight: '5rem'
    }

    const [dataSave, setDataSave] = useState([])
    let [week, setWeek] = useState([])
    const [monthName, setMonthName] = useState('')
    const [month, setMonth] = useState(0)
    const [year, setYear] = useState(0)

    // form
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [hours, setHours] = useState(0)
    const [minutes, setMinutes] = useState(0)
    const [times, setTimes] = useState('')
    const [dates, setDates] = useState('')

    const [changeSelect, setChangeSelect] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [showModalChoose, setShowModalChoose] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [errMsg, setErrMsg] = useState('')
    const [showModalErr, setShowModalErr] = useState(false)
    const [edited, setEdited] = useState(false)
    const [editedDates, setEditedDates] = useState(false)
    const [reset, setReset] = useState(false)
    const [indexData, setIndexData] = useState(0)
    const [indexTgl, setIndexTgl] = useState(0)
    const [today, setToday] = useState(new Date())
    const [dateNow, setDateNow] = useState(new Date())
    let bulanNama = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Augustus', 'September', 'October', 'November', 'December']
    let jam = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        waktu = ['AM', 'PM'],
        menit = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
            28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54,
            55, 56, 57, 58, 59]

    useEffect(() => {
        const interval = setInterval(() => {
            intersval()
        }, 100);

        return () => clearInterval(interval);
    }, [changeSelect, editedDates, reset]);

    function intersval() {
        weekGenerate()
        if (!changeSelect) {
            if (!editedDates) {
                setMonthName(bulanNama[today.getMonth()])
                setMonth(today.getMonth())
                setYear(today.getFullYear())
            }
            setMinutes(today.getMinutes())
            if (today.getHours() <= 12) {
                if (today.getHours() === 0) {
                    setHours(12)
                    setTimes('PM')
                } else {
                    setHours(today.getHours())
                    setTimes('AM')
                }
            } else {
                setHours((today.getHours() - 12))
                setTimes('PM')
            }
        }
    }

    useState(() => {
        let now = editedDates ? today : new Date()
        createDays(now.getFullYear(), now.getMonth())
    }, [])

    function clear() {
        setChangeSelect(false)
        setName('')
        setEmail('')
        setHours(0)
        setMinutes(0)
        setDates('')
        setTimes('')
        setErrMsg('')
        setShowModal(false)
        setShowAlert(false)
        setShowModalErr(false)
        setShowModalChoose(false)
        setEdited(false)
    }

    function weekGenerate() {
        let dataDummy = localStorage.getItem('events') ?? "[]"
        let dataDum = JSON.parse(dataDummy)
        setDataSave(dataDum)
    }

    function daysInMonth(iMonth, iYear) {
        let tgl = new Date(iYear, (parseInt(iMonth) + 1), 0)
        return tgl.getDate()
    }

    function createDays(year, month) {
        let firstDay = (new Date(year, month)).getDay()
        let date = 1
        let result = []

        for (let i = 0; i < 6; i++) {
            let row = []
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDay) {
                    row.push('')
                } else if (date > daysInMonth(month, year)) {
                    if (i === 5 && date === daysInMonth(month, year) + 1) {
                        if (j === 0 && date === daysInMonth(month, year) + 1) {
                            break
                        } else {
                            row.push('')
                        }
                    } else {
                        row.push('')
                    }

                } else {
                    row.push(date);
                    date++;
                }
            }
            result.push(row)
        }
        console.log(week)
        setWeek(result)
    }

    function openEvents(tgl) {
        let dataDummy = localStorage.getItem('events') ?? "[]"
        let dataDum = JSON.parse(dataDummy)
        if (dataDum.length > 0) {
            let check = dataDum.find((data) => data.month === month && data.year === year && data.date === tgl)
            if (check) {
                if (check.data.length === 3) {
                    setShowModalErr(true);
                    setErrMsg('Only 3 events can be added')
                    return
                }
            }
        }
        setDates(tgl)

        setShowModal(true)
    }

    function eventSaved() {
        if (name === '') {
            setShowAlert(true);
            setErrMsg('Name is required')
            return
        }
        if (email === '') {
            setShowAlert(true);
            setErrMsg('Email is required')
            return
        }
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            setShowAlert(true);
            setErrMsg('Incorrect E-mail')
            return
        }

        let dataDummy = localStorage.getItem('events') ?? "[]"
        let dataDum = JSON.parse(dataDummy)

        const randomColor = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();

        let data = []

        if (dataDum.length > 0) {
            // eslint-disable-next-line array-callback-return
            let check = dataDum.find((item) => item.month === month && item.year === year && item.date === dates)
            if (check) {
                check.data.push(
                    {
                        'bgColor': '#' + randomColor,
                        'name': name,
                        'email': email,
                        'hours': hours,
                        'minutes': minutes,
                        'times': times,
                    }
                )
            } else {
                dataDum.push(
                    {
                        'data': [
                            {
                                'bgColor': '#' + randomColor,
                                'name': name,
                                'email': email,
                                'hours': hours,
                                'minutes': minutes,
                                'times': times,
                            }
                        ],
                        'date': dates,
                        'month': month,
                        'year': year
                    }
                )
            }
            data = dataDum

        } else {
            data.push(
                {
                    'data': [
                        {
                            'bgColor': '#' + randomColor,
                            'name': name,
                            'email': email,
                            'hours': hours,
                            'minutes': minutes,
                            'times': times,
                        }
                    ],
                    'date': dates,
                    'month': month,
                    'year': year
                }
            )
        }
        localStorage.setItem('events', JSON.stringify(data))
        clear()
    }

    function remove(index, indexTgl) {
        let dataDummy = localStorage.getItem('events') ?? "[]"
        let dataDum = JSON.parse(dataDummy)
        dataDum[indexTgl].data.splice(index, 1)
        localStorage.setItem('events', JSON.stringify(dataDum))
    }

    function openEdited(indexData, indexTgl) {
        setIndexData(indexData)
        setIndexTgl(indexTgl)
        let dataDummy = localStorage.getItem('events') ?? "[]"
        let dataDum = JSON.parse(dataDummy)
        setEdited(true)
        setName(dataDum[indexTgl].data[indexData].name)
        setEmail(dataDum[indexTgl].data[indexData].email)
        setHours(dataDum[indexTgl].data[indexData].hours)
        setMinutes(dataDum[indexTgl].data[indexData].minutes)
        setTimes(dataDum[indexTgl].data[indexData].times)
        setDates(dataDum[indexTgl].date)
        setShowModal(true)
    }

    function saveEdited() {
        let dataDummy = localStorage.getItem('events') ?? "[]"
        let dataDum = JSON.parse(dataDummy)
        dataDum[indexTgl].data[indexData].name = name
        dataDum[indexTgl].data[indexData].email = email
        dataDum[indexTgl].data[indexData].hours = hours
        dataDum[indexTgl].data[indexData].minutes = minutes
        dataDum[indexTgl].data[indexData].times = times
        localStorage.setItem('events', JSON.stringify(dataDum))
        clear()
    }

    function openDates() {
        setShowModalChoose(true)
        setEditedDates(true)
    }

    function saveDates() {
        setToday(new Date(year, month, 1))
        setShowModalChoose(false)
        createDays(year, month)
        weekGenerate()
        intersval()
        setEditedDates(false)
        clear()
    }

    function resetDates() {
        setToday(new Date())
        createDays(dateNow.getFullYear(), dateNow.getMonth())
        setReset(!reset)
    }

    return week.length > 0 ? <>

        <div className={`modal bg-dark bg-opacity-50 fade ${showModalErr ? 'show' : ''}`}
             style={{display: showModalErr ? 'block' : 'none'}}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className={`alert alert-danger alert-dismissible m-0`}
                         role="alert">
                        <div className="text-start fs-6">{errMsg}</div>
                        <button type="button" className="btn-close" onClick={() => {
                            setShowModalErr(!showModalErr)
                        }} aria-label="Close"/>
                    </div>
                </div>
            </div>
        </div>

        <div className={`modal bg-dark bg-opacity-50 fade ${showModalChoose ? 'show' : ''}`}
             style={{display: showModalChoose ? 'block' : 'none'}}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">Choose Month and Year</h1>
                        <button type="button" className="btn-close" onClick={() => {
                            setEditedDates(false)
                            clear()
                        }} aria-label="Close"/>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3 text-start">
                            <label className="form-label">Month</label>
                            <select className="form-select" value={month}
                                    onChange={(e) => {
                                        setMonth(e.target.value)
                                        setMonthName(bulanNama[e.target.value])
                                    }}>
                                {
                                    bulanNama.map((data, id) => {
                                        return <option key={id} value={id}>{data}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className="mb-3 text-start">
                            <label className="form-label">Year</label>
                            <input type="number" className="form-control" id="exampleFormControlInput1"
                                   onChange={(e) => {
                                       setYear(e.target.value)
                                   }} placeholder="Name" defaultValue={year} value={year}/>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => {
                            setEditedDates(false)
                            clear()
                        }}>Close
                        </button>
                        <button onClick={() => {
                            saveDates()
                        }} type="button" className="btn btn-success">Save
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <h1 className="text-light py-2">{monthName} {year}
            <i className="px-2 bi bi-calendar3" onClick={() => {
                openDates()
            }} style={{cursor: 'pointer'}}/>
            {
                month === dateNow.getMonth() && year === dateNow.getFullYear() ? '' :
                    <i className="px-2 bi bi-arrow-clockwise" onClick={() => {
                        resetDates()
                    }} style={{cursor: 'pointer'}}/>
            }
        </h1>
        <div className="container-fluid text-center text-bg-light pt-2 pb-4 rounded-top">
            <div className="row fw-bold">
                <div className="col">
                    Sunday
                </div>
                <div className="col">
                    Monday
                </div>
                <div className="col">
                    Tuesday
                </div>
                <div className="col">
                    Wednesday
                </div>
                <div className="col">
                    Thursday
                </div>
                <div className="col">
                    Friday
                </div>
                <div className="col">
                    Saturday
                </div>
            </div>
        </div>
        <div className="container-fluid text-start text-bg-secondary bg-opacity-10 p-2 rounded-bottom">
            {week.map((data, id) => {
                return <div className="row fw-bold px-2" key={id}>
                    {
                        data.map((item, ind) => {
                            return <div key={ind}
                                        className={`col border border-opacity-25 px-2 py-1 border-light rounded-1 m-1 ${!ind ? "text-danger" : ""} 
                                        ${item === dateNow.getDate() && month === dateNow.getMonth() && year === dateNow.getFullYear() ? "bg-primary bg-opacity-25 bg-gradient" : ""}`}
                                        style={bodyCalendar}>
                                <div className="d-flex justify-content-between align-items-center text-shadow">
                                    <label>{item}</label> {item !== '' ?
                                    <i className="bi bi-plus-circle fs-6" style={{cursor: 'pointer'}}
                                       onClick={() => {
                                           openEvents(item)
                                       }}/> : ''}
                                </div>
                                {
                                    dataSave.length > 0 ?
                                        dataSave.map((val, indx) => {
                                            if (val.month === month && val.year === year && val.date === item) {
                                                return <>{
                                                    val.data.map((value, ids) => {
                                                        return <div key={ids}
                                                                    className="text-white p-2 m-0 my-2 rounded-1 bg-gradient"
                                                                    style={{
                                                                        backgroundColor: value.bgColor,
                                                                        textShadow: '2px 2px 5px #000000'
                                                                    }}
                                                        >
                                                            <div className="col-12">{value.name}</div>
                                                            <div className="col">{value.email}</div>
                                                            <div
                                                                className="col">{value.hours < 10 ? '0' + value.hours : value.hours}:{value.minutes < 10 ? '0' + value.minutes : value.minutes} {value.times}</div>
                                                            <div className="d-flex justify-content-end">
                                                                <i className="bi bi-pencil-fill mx-1"
                                                                   style={{cursor: 'pointer'}} onClick={() => {
                                                                    setEdited(true)
                                                                    setChangeSelect(true)
                                                                    openEdited(ids, indx)
                                                                }}/>
                                                                <i className="bi bi-trash mx-1"
                                                                   style={{cursor: 'pointer'}} onClick={() => {
                                                                    remove(ids, indx)
                                                                }}/>
                                                            </div>
                                                        </div>
                                                    })
                                                }
                                                </>
                                            }
                                            return ''
                                        })
                                        : ''
                                }
                            </div>
                        })
                    }
                </div>
            })}
        </div>


        {/*Modal */}
        <div className={`modal bg-dark bg-opacity-50 fade ${showModal ? 'show' : ''}`}
             style={{display: showModal ? 'block' : 'none'}} id="staticBackdrop" data-bs-backdrop="static"
             data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className={`alert alert-danger alert-dismissible ${showAlert ? 'd-block' : 'd-none'}`}
                         role="alert">
                        <div className="text-start fs-6">{errMsg}</div>
                        <button type="button" className="btn-close" onClick={() => {
                            setShowAlert(!showAlert)
                        }} aria-label="Close"/>
                    </div>
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">Add Event</h1>
                        <button type="button" className="btn-close" onClick={() => {
                            clear()
                        }} aria-label="Close"/>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3 text-start">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Name</label>
                            <input type="text" className="form-control" id="exampleFormControlInput1" onChange={(e) => {
                                setName(e.target.value)
                            }} placeholder="Name" defaultValue={name} value={name}/>
                        </div>
                        <div className="mb-3 text-start">
                            <label htmlFor="exampleFormControlInput2" className="form-label">Time</label>
                            <div className="input-group mb-3">
                                <span className="input-group-text bi bi-clock" id="basic-addon1"/>
                                <select className="form-select" value={hours}
                                        onChange={(e) => {
                                            setChangeSelect(true)
                                            setHours(e.target.value)
                                        }}>
                                    {
                                        jam.map((data, id) => {
                                            return <option key={id} value={data}>{data}</option>
                                        })
                                    }
                                </select>
                                <select className="form-select" value={minutes}
                                        onChange={(e) => {
                                            setChangeSelect(true)
                                            setMinutes(e.target.value)
                                        }}>
                                    {
                                        menit.map((data, id) => {
                                            return <option key={id} value={data}>{data}</option>
                                        })
                                    }
                                </select>
                                <select className="form-select" value={times}
                                        onChange={(e) => {
                                            setChangeSelect(true)
                                            setTimes(e.target.value)
                                        }}>
                                    {
                                        waktu.map((data, id) => {
                                            return <option key={id} value={data}>{data}</option>
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="mb-3 text-start">
                            <label htmlFor="exampleFormControlInput3" className="form-label">Email address</label>
                            <input type="email" className="form-control" id="exampleFormControlInput3"
                                   onChange={(e) => {
                                       setEmail(e.target.value)
                                   }} placeholder="name@example.com" defaultValue={email} value={email}/>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => {
                            clear()
                        }}>Close
                        </button>
                        <button onClick={() => {
                            edited ? saveEdited() : eventSaved()
                        }} type="button" className="btn btn-success">Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </> : <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div
            className="card align-items-center justify-content-center h6 bg-opacity-10 bg-dark bg-gradient text-white border-0"
            style={{width: '5rem', height: '5rem'}}>
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    </div>
}

export default Home