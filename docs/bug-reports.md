# Bug Reports – Restful-Booker API

Found while testing the public [Restful-Booker](https://restful-booker.herokuapp.com/apidoc) API.
Each bug has an automated test in [`tests/known-bugs.spec.ts`](../tests/known-bugs.spec.ts). The test is marked with `test.fail()`, so the CI stays green while the bug exists. If the API gets fixed, the test starts failing and tells us.

| ID | Title | Severity | Priority |
|---|---|---|---|
| BUG-01 | Wrong credentials return 200 instead of 401 | Medium | Medium |
| BUG-02 | Booking with missing fields returns 500 instead of 400 | High | High |
| BUG-03 | Booking with a negative total price is accepted | High | High |
| BUG-04 | Booking with checkout before checkin is accepted | High | High |
| BUG-05 | DELETE of a missing booking returns 405 instead of 404 | Low | Low |
| BUG-06 | Successful DELETE returns 201 Created | Low | Low |

---

### BUG-01: Wrong credentials return 200 instead of 401

**Endpoint:** `POST /auth`
**Severity:** Medium · **Priority:** Medium

**Steps to reproduce**

```bash
curl -i -X POST https://restful-booker.herokuapp.com/auth \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"wrong"}'
```

**Expected:** `401 Unauthorized`
**Actual:** `200 OK` with body `{"reason":"Bad credentials"}`

**Impact:** Clients must read the body to know that login failed. Monitoring tools that count 4xx errors will not see failed logins.

---

### BUG-02: Booking with missing fields returns 500 instead of 400

**Endpoint:** `POST /booking`
**Severity:** High · **Priority:** High

**Steps to reproduce**

```bash
curl -i -X POST https://restful-booker.herokuapp.com/booking \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  -d '{"firstname":"OnlyFirstName"}'
```

**Expected:** `400 Bad Request` with a message that lists the missing fields
**Actual:** `500 Internal Server Error`

**Impact:** The server does not validate the input and crashes. The client gets no useful error message.

---

### BUG-03: Booking with a negative total price is accepted

**Endpoint:** `POST /booking`
**Severity:** High · **Priority:** High

**Steps to reproduce**

```bash
curl -i -X POST https://restful-booker.herokuapp.com/booking \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  -d '{"firstname":"A","lastname":"B","totalprice":-100,"depositpaid":false,"bookingdates":{"checkin":"2027-01-01","checkout":"2027-01-05"}}'
```

**Expected:** `400 Bad Request`
**Actual:** `200 OK`, the booking is created with `"totalprice": -100`

**Impact:** Invalid financial data is saved.

---

### BUG-04: Booking with checkout before checkin is accepted

**Endpoint:** `POST /booking`
**Severity:** High · **Priority:** High

**Steps to reproduce**

```bash
curl -i -X POST https://restful-booker.herokuapp.com/booking \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  -d '{"firstname":"A","lastname":"B","totalprice":100,"depositpaid":false,"bookingdates":{"checkin":"2027-01-10","checkout":"2027-01-01"}}'
```

**Expected:** `400 Bad Request`
**Actual:** `200 OK`, the booking is created with checkout 9 days before checkin

**Impact:** Impossible bookings are saved. Reports based on stay length will be wrong.

---

### BUG-05: DELETE of a missing booking returns 405 instead of 404

**Endpoint:** `DELETE /booking/{id}`
**Severity:** Low · **Priority:** Low

**Steps to reproduce**

1. Get a token with `POST /auth`
2. `DELETE /booking/999999999` with header `Cookie: token=<token>`

**Expected:** `404 Not Found`
**Actual:** `405 Method Not Allowed`

**Impact:** 405 means the method is not supported, which is wrong and confusing for clients.

---

### BUG-06: Successful DELETE returns 201 Created

**Endpoint:** `DELETE /booking/{id}`
**Severity:** Low · **Priority:** Low

**Steps to reproduce**

1. Create a booking and get a token
2. `DELETE /booking/{id}` with header `Cookie: token=<token>`

**Expected:** `200 OK` or `204 No Content`
**Actual:** `201 Created`

**Impact:** 201 means a new resource was created. Clients that check for 200/204 will treat a successful delete as an error.
