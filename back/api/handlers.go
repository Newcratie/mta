package api

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/johnnadratowski/golang-neo4j-bolt-driver/structures/graph"
	"math"
	"strconv"
	"strings"
	"time"
)

const (
	InfoC    = "\033[1;34m%s\033[0m"
	NoticeC  = "\033[1;36m%s\033[0m"
	WarningC = "\033[1;33m%s\033[0m"
	ErrorC   = "\033[1;31m%s\033[0m"
	DebugC   = "\033[0;36m%s\033[0m"
)

func Token(c *gin.Context) {
	q := `MATCH (n:User{random_token : "` + c.Param("token") + `"}) SET n.access_lvl = 1 RETURN n`
	data, _, _, _ := app.Neo.QueryNeoAll(q, nil)
	if len(data) == 0 {
		c.JSON(201, gin.H{"err": "Wrong token"})
	} else if data[0][0].(graph.Node).Properties["access_lvl"] == int64(1) {
		c.JSON(201, gin.H{"status": "Email validated"})
	}
}

func createRelation(c *gin.Context) {

	claims := jwt.MapClaims{}
	valid, err := ValidateToken(c, &claims)

	if valid == true {
		var m Match
		id := int(claims["id"].(float64))
		UpdateLastConn(id)
		m.idTo, _ = strconv.Atoi(c.Param("id"))
		m.action = strings.ToUpper(c.Param("action"))
		m.idFrom = id
		m.c = c
		if _, err = app.dbMatchs(m); err != nil {
			c.JSON(201, gin.H{"err": err.Error()})
		} else {
			c.JSON(200, nil)
		}
	} else {
		c.JSON(201, gin.H{"err": err.Error()})
	}
}

func ValidateToken(c *gin.Context, claims jwt.Claims) (valid bool, err error) {

	if claims == nil {
		err := errors.New("error : Invalide token")
		c.JSON(201, gin.H{"err": err.Error()})
		return false, err
	}

	tokenString := c.Request.Header["Authorization"][0]
	_, err = jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(HashKey), nil
	})
	if err != nil {
		c.JSON(201, gin.H{"err": err.Error()})
		return false, err
	} else if checkJwt(tokenString) {
		return true, err
	}
	return false, err
}

func Next(c *gin.Context) {
	c.Header("Content-Type", "application/json")
	c.JSON(200, gin.H{
		"next": "next",
	})
}

func GetMatchs(c *gin.Context) {
	tokenString := c.Request.Header["Authorization"][0]

	claims := jwt.MapClaims{}
	_, err := jwt.ParseWithClaims(tokenString, &claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(HashKey), nil
	})

	id := int(math.Round(claims["id"].(float64)))
	UpdateLastConn(id)

	if err != nil {
		c.JSON(202, gin.H{"err": err.Error()})
	} else if checkJwt(tokenString) {
		app.onlineRefresh(strconv.Itoa(id))
		g, err := app.dbGetMatchs(id)
		if err != nil {
			c.JSON(201, gin.H{"err": err.Error()})
		} else {
			c.JSON(200, g)
		}
	}
}
func GetMessages(c *gin.Context) {
	tokenString := c.Request.Header["Authorization"][0]
	suitorId := c.Request.Header["Suitor-Id"][0]

	claims := jwt.MapClaims{}
	_, err := jwt.ParseWithClaims(tokenString, &claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(HashKey), nil
	})

	id := int(math.Round(claims["id"].(float64)))
	UpdateLastConn(id)

	if err != nil {
		c.JSON(202, gin.H{"err": err.Error()})
	} else if checkJwt(tokenString) {
		sui, _ := strconv.Atoi(suitorId)
		app.onlineRefresh(strconv.Itoa(id))
		msgs, err := app.dbGetMessages(id, sui)
		if err != nil {
			c.JSON(201, gin.H{"err": err.Error()})
		} else {
			c.JSON(200, msgs)
		}
	}
}

//func getMatchPeople(g []graph.Node) []graph.Node {
//	sort.Sort()
//}
func CheckUserAccess(Id int) bool {
	u, err := app.getUser(Id, "")
	if err != nil {
		return false
	} else if u.AccessLvl != 2 {
		return false
	}
	return true
}

func GetPeople(c *gin.Context) {
	filtersJson := c.Request.Header["Filters"][0]
	var err error

	filters := Filters{}
	claims := jwt.MapClaims{}
	valid, err := ValidateToken(c, &claims)

	json.Unmarshal([]byte(filtersJson), &filters)

	if err != nil {
		c.JSON(202, gin.H{"err": err.Error()})
	} else if valid == true {
		id := int(claims["id"].(float64))
		if CheckUserAccess(id) == false {
			c.JSON(201, gin.H{"err": "Please put a Profil picture"})
			return
		}
		str := strconv.Itoa(id)
		app.onlineRefresh(str)
		app.alertOnline(true, str)
		g, err := app.dbGetPeople(id, &filters)
		if err != nil {
			c.JSON(201, gin.H{"err": err.Error()})
		} else {
			UpdateLastConn(id)
			c.JSON(200, g)
		}
	} else {
		c.JSON(201, gin.H{"err": err.Error()})
	}
}

func Recommended(c *gin.Context) {
	var err error
	var Page int
	claims := jwt.MapClaims{}
	Page = 2

	valid, err := ValidateToken(c, &claims)

	if err != nil {
		c.JSON(202, gin.H{"err": err.Error()})
	} else if valid == true {
		id := int(claims["id"].(float64))
		if CheckUserAccess(id) == false {
			c.JSON(201, gin.H{"err": "Please put a Profil picture"})
			return
		}
		str := strconv.Itoa(id)
		app.onlineRefresh(str)
		app.alertOnline(true, str)
		g, err := app.dbGetRecommended(id, Page)
		if err != nil {
			c.JSON(201, gin.H{"err": err.Error()})
		} else {
			UpdateLastConn(id)
			c.JSON(200, g)
		}
	} else {
		c.JSON(201, gin.H{"err": err.Error()})
	}
}

func ReportHandler(c *gin.Context) {
	claims := jwt.MapClaims{}
	valid, err := ValidateToken(c, &claims)

	if valid == true {
		id := int(claims["id"].(float64))
		u, err := app.getUser(id, "")
		if err != nil {
			c.JSON(201, gin.H{"err": err.Error()})
			return
		}
		username := c.Param("username")
		message := "The following user has been reported by " + u.Username + " : "
		UpdateLastConn(id)
		if err = SendReportmail("Report User", username, "camagru4422@gmail.com", message); err != nil {
			fmt.Println("EMAIL ERROR")
			c.JSON(201, gin.H{"err": err.Error()})
		} else {
			fmt.Println("EMAIL OK")
			c.JSON(200, nil)
		}
	} else {
		c.JSON(201, gin.H{"err": err.Error()})
	}
}

func newVisit(c *gin.Context) {
	newEvent(c, func(name string) string {
		return name + " has visited your profil page"
	})
	c.JSON(200, gin.H{})
}

func UpdateLastConn(Id int) {
	u, _ := app.getUser(Id, "")
	u.Id = int64(Id)
	u.LastConn, _ = time.Parse(time.RFC3339, time.Now().Format(time.RFC3339Nano))
	u.Online = true
	app.updateLastConn(u)
}

func Login(c *gin.Context) {
	username := c.PostForm("username")
	password := c.PostForm("password")

	u, err := app.getUser(-1, username)
	if u.AccessLvl < 1 {
		c.JSON(201, gin.H{"err": "Please activate your account"})
	} else if err != nil || password != Decrypt(HashKey, u.Password) {
		c.JSON(201, gin.H{"err": "Wrong password or username"})
	} else if u.AccessLvl == 0 {
		c.JSON(201, gin.H{"err": "You must validate your Email first"})
	} else {
		jwt, err := u.GenerateJwt()
		if err != nil {
			c.JSON(201, gin.H{"err": "Internal server error: " + err.Error()})
		} else {
			c.JSON(200, jwt)
		}
	}
}

func Register(c *gin.Context) {
	bd, _ := time.Parse(time.RFC3339, c.PostForm("birthday"))

	rf := registerForm{
		c.PostForm("username"),
		c.PostForm("email"),
		c.PostForm("password"),
		c.PostForm("confirm"),
		c.PostForm("lastname"),
		c.PostForm("firstname"),
		bd,
	}
	user, res := validateUser(rf)
	if !res.Valid {
		c.JSON(201, res)
	} else {
		app.insertUser(user)
		c.JSON(200, gin.H{})
	}
}

func Forgot(c *gin.Context) {
	username := c.PostForm("username")
	u, err := app.getUser(-1, username)
	if err != nil {
		c.JSON(201, gin.H{"err": "Wrong username"})
		return
	} else {
		u.RandomToken = newToken()
		app.updateUser(u)
		SendEmailPasswordForgot(username, u.Email, u.RandomToken)
	}
	return
}

func ResetPassword(c *gin.Context) {
	token := c.PostForm("reset-token")
	password := c.PostForm("password")
	confirm := c.PostForm("confirm")
	username := c.PostForm("username")

	u, err := app.getUser(-1, username)
	if err != nil || u.RandomToken != token {
		c.JSON(201, gin.H{"err": "Wrong username or token"})
	} else {
		if err = verifyPassword(password, confirm); err != nil {
			c.JSON(201, gin.H{"err": err.Error()})
		} else {
			u.Password = Encrypt(HashKey, password)
			app.updateUser(u)
		}
	}

}
