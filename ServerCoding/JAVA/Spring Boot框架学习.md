### Spring Boot框架学习

#### 1.1.环境配置

>JAVA：JDK-10
>
>开发工具：Spring Tool Suite（基于Eclipse） STS 需要修改JDK版本和安装JDK版本一致



#### 1.2.操作步骤

>+ 打开https://start.spring.io/ 生成框架
>
>+ 打开 STS 导入 Maven Projects 
>
>+ 配置maven本地仓库
>
>+ 右击 pom.xml --->  add dependencys 如果找不到对应jar包（ window--> show view-->
>
>  maven--> local repositories--> local repostory -->rebuild idex)
>
>+ ​



#### 1.3. application.properties 配置mybaties和mysql等

>配置代码
>
>```java
>#DB Configuration
>spring.datasource.driverClassName=com.mysql.jdbc.Driver
>spring.datasource.url=jdbc:mysql://localhost:3306/microservice
>spring.datasource.username=root
>spring.datasource.password=mis
>```
>
>



#### 1.4.入门程序

>介绍：spring boot 集成 mybatis  操作数据库
>
>1. maven 添加 dependencys :   mysql    mybatis
>
>2. 添加javabean
>
>   ```java
>   public class User implements Serializable {
>
>   	/**
>   	 * 
>   	 */
>   	private static final long serialVersionUID = 1L;
>   	
>   	private Integer f_id;
>   	private String f_name;
>   	private String f_address;
>   	public Integer getF_id() {
>   		return f_id;
>   	}
>   	public void setF_id(Integer f_id) {
>   		this.f_id = f_id;
>   	}
>   	public String getF_name() {
>   		return f_name;
>   	}
>   	public void setF_name(String f_name) {
>   		this.f_name = f_name;
>   	}
>   	public String getF_address() {
>   		return f_address;
>   	}
>   	public void setF_address(String f_address) {
>   		this.f_address = f_address;
>   	}
>   	
>
>   }
>   ```
>
>3. 添加javaDao  mapper
>
>   ```java
>   @Mapper
>   public interface UserMapper {
>   	
>   	@Select("select * from t_user")
>   	public List<User> queryUsers();
>   	
>   	@Delete("delete from t_user where id= #{id}")
>   	public void delUserById(Integer id);
>   }
>   ```
>
>4. Service 接口  
>
>   ```java
>   public interface UserService {
>   	
>   	public List<User> queryUsers();
>   	
>   	public void delUserById(Integer id);
>   }
>
>   ```
>
>5. 实现 Service 接口
>
>   ```java
>   @Service
>   @Transactional  //控制事务
>   public class UserServiceImpl implements UserService {
>   	
>   	//注入mapper
>   	@Autowired
>   	private UserMapper userMapper;
>   	
>   	@Override
>   	public List<User> queryUsers() {
>   		// TODO Auto-generated method stub
>   		List<User> list=userMapper.queryUsers();
>   		return list;
>   	}
>
>   	@Override
>   	public void delUserById(Integer id) {
>   		// TODO Auto-generated method stub
>   		userMapper.delUserById(id);
>   	}
>
>   }
>   ```
>
>6. controller
>
>   ```java
>   @RestController
>   @RequestMapping("/user")
>   public class UserController {
>   	
>   	@Autowired   //引入service
>   	public UserService userService;
>   	
>   	@RequestMapping("/userlist")
>   	public List<User> userList(){
>   		List<User> list=userService.queryUsers();
>   		return list;
>   	}
>   	
>   }
>   ```
>
>7. ​



#### 1.5. string boot 打包成jar 或者war

>右击  pom.xml --> run as --> maven buidld -->package 



### Spring Cloud 学习

#### 2.1 使用Eureka 注册服务

>介绍：Eureka是负责微服务架构中服务治理的功能，负责各个微服务实例的自动注册和发现
>
>参考：[Eureka简介](https://www.cnblogs.com/woshimrf/p/springclout-eureka.html)
>
>



#### 2.2 Eureka服务创建与调用

>1. 创建Maven工程
>
>   new --> Maven Project-->勾选Create a simple project -->下一步 -->package 选择 pom
>
>   修改pom.xml文件 (增加 jdk版本信息，dependency，编译插件等，按需加)
>
>   ```xml
>   <parent>
>   		<groupId>org.springframework.boot</groupId>
>   		<artifactId>spring-boot-starter-parent</artifactId>
>   		<version>1.5.6.RELEASE</version>
>   		<relativePath />
>   	</parent>
>   	<properties>
>   		<project.build.sourceEncoding>
>   			UTF-8
>   		</project.build.sourceEncoding>
>   		<project.reporting.outputEncoding>
>   			UTF-8
>   		</project.reporting.outputEncoding>
>   		<java.version>1.8</java.version>
>   	</properties>
>   	<dependencyManagement>
>   		<dependencies>
>   			<dependency>
>   				<groupId>org.springframework.cloud</groupId>
>   				<artifactId>spring-cloud-dependencies</artifactId>
>   				<version>Dalston.SR3</version>
>   				<type>pom</type>
>   				<scope>import</scope>
>   			</dependency>
>   		</dependencies>
>   	</dependencyManagement>
>   	<build>
>   		<plugins>
>   			<!--Spring Boot的编译插件 -->
>   			<plugin>
>   				<groupId>org.springframework.boot</groupId>
>   				<artifactId>spring-boot-maven-plugin</artifactId>
>   			</plugin>
>   		</plugins>
>   	</build>
>   ```
>
>2. 创建Maven 子工程 （Eureka 注册中心）
>
>   选中父工程--> maven-->new maven module project -->  package 选择jar 包即可
>
>   2.1 修改pom.xml文件 （按需加入插件,注意：高版本JDK jaxb 需要手动加入）
>
>   ```xml
>   <dependencies>
>   		<dependency>
>   			<groupId>org.springframework.cloud</groupId>
>   			<artifactId>spring-cloud-starter-eureka-server</artifactId>
>   		</dependency>
>   		<!-- jaxb模块引用 - start -->
>   		<dependency>
>   			<groupId>javax.xml.bind</groupId>
>   			<artifactId>jaxb-api</artifactId>
>   			<version>2.2.12</version>
>   		</dependency>
>   		<dependency>
>   			<groupId>com.sun.xml.bind</groupId>
>   			<artifactId>jaxb-impl</artifactId>
>   			<version>2.3.0</version>
>   		</dependency>
>   		<dependency>
>   			<groupId>org.glassfish.jaxb</groupId>
>   			<artifactId>jaxb-runtime</artifactId>
>   			<version>2.3.0</version>
>   		</dependency>
>   		<dependency>
>   			<groupId>javax.activation</groupId>
>   			<artifactId>activation</artifactId>
>   			<version>1.1.1</version>
>   		</dependency>
>   		<!-- jaxb模块引用 - end -->
>   	</dependencies>
>   ```
>
>   2.2 新增配置文件 src/main/resources---->application.yml
>
>   ```yaml
>   server:
>     port: 8088    # 注册中心端口
>   eureka:
>     instance:
>       hostname: localhost
>     client:
>       register-with-eureka: false
>       fetch-registry: false
>       service-url:
>         defaultZone: http://${eureka.instance.hostname}:${server.port}/eureka/
>   #  server:
>   #    enable-self-preservation: false
>   ```
>
>   2.3 增加注册中心 入口  EurekaApplication.java
>
>   ```java
>   package com.itbin.springcloud;
>
>   import org.springframework.boot.SpringApplication;
>   import org.springframework.boot.autoconfigure.SpringBootApplication;
>   import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;
>
>   /* 
>    * eureka server
>    * */
>   @SpringBootApplication
>   @EnableEurekaServer
>   public class EurekaApplication {
>   	public static void main(String[] args) {
>   		SpringApplication.run(EurekaApplication.class, args);
>   	}
>   }
>
>   ```
>
>   启动查看是否成功
>
>3. 创建服务提供者
>
>4. 创建服务使用者
>
>5. ​



#### 2.4 客户端负载均衡（Ribbon）

>在实例化RestTemplate的时候加上注解  @LoadBalanced 即可



#### 2.5 Spring Cloud Hystrix 容错

>断路器，服务容错
>
>1.application 中加入  @EnableCircuitBreaker 注解
>
>```java
>@SpringBootApplication
>@EnableCircuitBreaker //开启断路器
>@EnableEurekaClient
>public class Application {
>	
>	@Bean
>	@LoadBalanced
>	public RestTemplate restTemplate() {
>		return new RestTemplate();
>	}
>	
>	public static void main(String[] args) {
>		SpringApplication.run(Application.class, args);
>	}
>}
>```
>
>2.controller  接口方法中加入 @HystrixCommand(fallbackMethod="fallbackInfo")
>
>```java
>@RestController
>public class UserController {
>	
>	@Autowired
>	private RestTemplate restTemplate;
>	
>	@GetMapping("/findOrdersByUser/{id}")
>	@HystrixCommand(fallbackMethod="fallbackInfo")
>	public String findOrdersByUser(@PathVariable String id) {
>		int oid=123;
>		return restTemplate.getForObject("http://microservice-eureka-order/order/"+oid, String.class);
>	}
>	
>	public String fallbackInfo(@PathVariable String id) {
>		return "服务不可用，请稍后再试";
>	}
>}
>```
>
>3.pom.xml 增加配置
>
>```xml
><dependencies>
>		<dependency>
>			<groupId>org.springframework.cloud</groupId>
>			<artifactId>spring-cloud-starter-eureka</artifactId>
>		</dependency>
>		<!-- Hystrix依赖 -->
>		<dependency>
>			<groupId>org.springframework.cloud</groupId>
>			<artifactId>spring-cloud-starter-hystrix</artifactId>
>		</dependency>
>		<dependency>
>			<groupId>org.springframework.boot</groupId>
>			<artifactId>spring-boot-starter-actuator</artifactId>
>		</dependency>
>	</dependencies>
>```
>
>



#### 2.6 hystrix dashboard 统计服务请求

>利用hystrix dashboard 查看服务请求情况
>
>1. 新增maven 子工程
>
>2. 增加pom.xml dependency
>
>   ```xml
>   <dependencies>
>   		<dependency>
>   			<groupId>org.springframework.cloud</groupId>
>   			<artifactId>
>     			spring-cloud-starter-hystrix-dashboard
>     		</artifactId>
>   		</dependency>
>   		<dependency>
>   			<groupId>org.springframework.boot</groupId>
>   			<artifactId>spring-boot-starter-actuator</artifactId>
>   		</dependency>
>   	</dependencies>
>   ```
>
>3. 修改application.yml配置
>
>   ```xml
>   server:
>     port: 8031
>   spring:
>     application:
>       name: microservice-hystrix-dashboard
>   ```
>
>4. 增加入口 application.java
>
>   ```java
>   @SpringBootApplication
>   @EnableHystrixDashboard //设置dashboard可用的注解
>   public class Application {
>   	public static void main(String[] args) {
>   		SpringApplication.run(Application.class, args);
>   	}
>   }
>   ```
>
>5. 访问地址   http://localhost:8031/hystrix.stream
>
>6. ​



 ### 3.API 网关服务  zuul

>1. pom.xml 添加相关依赖
>
>   ```xml
>   <dependencies>
>   		<dependency>
>   			<groupId>org.springframework.cloud</groupId>
>   			<artifactId>spring-cloud-starter-zuul</artifactId>
>   		</dependency>
>   		<dependency>
>   		<groupId>org.springframework.cloud</groupId>
>   		<artifactId>spring-cloud-starter-eureka</artifactId>
>   		</dependency>
>   	</dependencies>
>   ```
>
>2. 修改application.yml
>
>   ```xml
>   server:
>     port: 8050
>   eureka:
>     instance:
>       prefer-ip-address: true
>     client:
>       service-url:
>         defaultZone: http://localhost:8088/eureka/
>   spring:
>     application:
>       name: microservice-gateway-zuul
>   zuul:
>     routes:
>       order-serviceId: 
>         path: /order/**
>         service-id: microservice-eureka-order
>   ```
>
>3. 添加启动类
>
>   ```java
>   @SpringBootApplication
>   @EnableZuulProxy   //zuul相关注解
>   public class Application {
>   	public static void main(String[] args) {
>   		SpringApplication.run(Application.class, args);
>   	}
>   }
>   ```
>
>4.  



### 4.Spring Cloud Config

#### 4.1 配置config server

>1. 增加依赖
>
>   ```xml
>   <dependencies>
>   		<dependency>
>   			<groupId>org.springframework.cloud</groupId>
>   			<artifactId>spring-cloud-config-server</artifactId>
>   		</dependency>
>   		<dependency>
>   			<groupId>org.springframework.boot</groupId>
>   			<artifactId>spring-boot-devtools</artifactId>
>   			<version>2.0.0.M5</version>
>   		</dependency>
>   	</dependencies>
>   ```
>
>2. 修改yml 配置文件 （本地配置文件）
>
>   ```xml
>   spring:
>     application:
>       name: microservice-config-server
>     profiles:
>       active: native
>   server:
>     port: 8888
>   ```
>
>3. 新增config 配置项
>
>   增加  application-prod.yml  application-dev.yml  application-test.yml  
>
>4. 增加启动类
>
>   ```java
>   @SpringBootApplication
>   @EnableConfigServer
>   public class Application {
>   	public static void main(String[] args){
>   		SpringApplication.run(Application.class, args);
>   	}
>   }
>   ```

#### 4.2 Config Client

>1. 增加依赖项
>
>   ```xml
>   <dependencies>
>     	<dependency>
>     		<groupId>org.springframework.cloud</groupId>
>     		<artifactId>spring-cloud-starter-config</artifactId>
>     	</dependency>
>     	<dependency>
>     		<groupId>org.springframework.boot</groupId>
>     		<artifactId>spring-boot-starter-web</artifactId>
>     	</dependency>
>     	<!-- <dependency>
>     		<groupId>org.springframework.boot</groupId>
>     		<artifactId>spring-boot-devtools</artifactId>
>     	</dependency>
>     	<dependency>
>     		<groupId>org.springframework.boot</groupId>
>     		<artifactId>spring-boot-starter-actuator</artifactId>
>     	</dependency> -->
>     </dependencies>
>   ```
>
>2. 修改配置文件  注意这边的配置文件是 bootstrap.yml 因为 bootstrap.yml 优先于application.yml 加载
>
>   ```xml
>   spring:
>     application:
>       name: microservice-config-client
>     cloud:
>       config:
>         profile: prod
>         uri: http://localhost:8888/
>   server:
>     port: 8801
>   ```
>
>3. 增加启动类
>
>   ```java
>   @SpringBootApplication
>   @RestController
>   @RefreshScope
>   public class Application {
>   	
>   	@Value("${clientParam}")
>   	public String clientParam;
>   	
>   	@RequestMapping("/clientParam")
>   	public String getClientParam() {
>   		return this.clientParam;
>   	}
>   	
>   	@RequestMapping("/hello")
>   	public String sayHello() {
>   		return "hello";
>   	}
>   	
>   	public static void main(String[] args) {
>   		SpringApplication.run(Application.class, args);
>   	}
>   }
>   ```





