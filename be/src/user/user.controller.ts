import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Query,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { UserInfoDto } from "./dto/userInfo.dto";
import { UserService } from "./user.service";
import { GetUser, TokenInfo } from "./user.decorator";
import { AuthGuard } from "@nestjs/passport";
import { SearchInfoDto } from "../restaurant/dto/seachInfo.dto";
import { LocationDto } from "src/restaurant/dto/location.dto";
import { ReviewInfoDto } from "src/review/dto/reviewInfo.dto";
import { ParseArrayPipe } from "../utils/parsearraypipe";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) { }

  @ApiTags("Mypage")
  @Get()
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "마이페이지 유저 수정페이지 정보 가져오기" })
  @ApiResponse({
    status: 200,
    description: "마이페이지 수정페이지 정보 요청 성공",
  })
  @ApiResponse({ status: 401, description: "인증 실패" })
  @ApiResponse({ status: 400, description: "부적절한 요청" })
  async getMypageUserDetailInfo(@GetUser() tokenInfo: TokenInfo) {
    return await this.userService.getMypageUserDetailInfo(tokenInfo);
  }

  @ApiTags("Mypage")
  @Get("/details")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "마이페이지 유저 정보 가져오기" })
  @ApiResponse({ status: 200, description: "마이페이지 정보 요청 성공" })
  @ApiResponse({ status: 401, description: "인증 실패" })
  @ApiResponse({ status: 400, description: "부적절한 요청" })
  async getMypageUserInfo(@GetUser() tokenInfo: TokenInfo) {
    return await this.userService.getMypageUserInfo(tokenInfo);
  }

  @ApiTags("Follow/Following")
  @Get(":nickName/details")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "다른 유저 메인 마이페이지 유저 정보 가져오기" })
  @ApiResponse({
    status: 200,
    description: "다른 유저 메인 마이페이지 정보 요청 성공",
  })
  @ApiResponse({ status: 401, description: "인증 실패" })
  @ApiResponse({ status: 400, description: "부적절한 요청" })
  async getMypageTargetUserInfo(
    @GetUser() tokenInfo: TokenInfo,
    @Param("nickName") nickName: string
  ) {
    return await this.userService.getMypageTargetUserInfo(tokenInfo, nickName);
  }

  @ApiTags("Follow/Following")
  @Get("/autocomplete/:partialUsername")
  @UseGuards(AuthGuard("jwt"))
  @ApiQuery({
    name: 'region',
    required: false,
    type: String,
    isArray: true,
    description: '필터링할 지역 목록을 쉼표(,)로 구분하여 제공'
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: "다른 유저 검색 자동완성" })
  @ApiResponse({ status: 200, description: "다른 유저 검색 자동완성 완성" })
  @ApiResponse({ status: 401, description: "인증 실패" })
  @ApiResponse({ status: 400, description: "부적절한 요청" })
  async searchTargetUser(
    @GetUser() tokenInfo: TokenInfo,
    @Param("partialUsername") partialUsername: string,
    @Query("region", ParseArrayPipe) region: string[]
  ) {
    return await this.userService.searchTargetUser(tokenInfo, partialUsername, region);
  }

  @ApiTags("Signup", "Mypage")
  @Get("nickname/:nickname/exists")
  @ApiParam({
    name: "nickname",
    required: true,
    description: "확인하고자 하는 닉네임",
    type: String,
  })
  @ApiOperation({ summary: "닉네임 중복확인" })
  @ApiResponse({ status: 200, description: "닉네임 중복확인 요청 성공" })
  @ApiResponse({ status: 400, description: "부적절한 요청" })
  async getNickNameAvailability(
    @Param("nickname") nickname: UserInfoDto["nickName"]
  ) {
    return await this.userService.getNickNameAvailability(nickname);
  }

  @ApiTags("Signup", "Mypage")
  @Get("email/:email/exists")
  @ApiParam({
    name: "email",
    required: true,
    description: "확인하고자 하는 이메일",
    type: String,
  })
  @ApiOperation({ summary: "이메일 중복확인" })
  @ApiResponse({ status: 200, description: "이메일 중복확인 요청 성공" })
  @ApiResponse({ status: 400, description: "부적절한 요청" })
  async getEmailAvailability(@Param("email") email: UserInfoDto["email"]) {
    return await this.userService.getEmailAvailability(email);
  }

  @ApiTags("Mypage", "Home")
  @Get("/restaurant")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "내 맛집 리스트 정보 가져오기" })
  @ApiQuery({
    name: "latitude",
    required: false,
    type: String,
    description: "위도",
  })
  @ApiQuery({
    name: "longitude",
    required: false,
    type: String,
    description: "경도",
  })
  @ApiQuery({
    name: "radius",
    required: false,
    type: String,
    description: "검색 반경",
  })
  @ApiResponse({ status: 200, description: "내 맛집 리스트 정보 요청 성공" })
  @ApiResponse({ status: 401, description: "인증 실패" })
  @ApiResponse({ status: 400, description: "부적절한 요청" })
  async getMyRestaurantListInfo(
    @Query() locationDto: LocationDto,
    @GetUser() tokenInfo: TokenInfo
  ) {
    const searchInfoDto = new SearchInfoDto("", locationDto);
    return await this.userService.getMyRestaurantListInfo(
      searchInfoDto,
      tokenInfo
    );
  }

  @ApiTags("Mypage")
  @Get("/wish-restaurant")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "내 위시 맛집 리스트 정보 가져오기" })
  @ApiResponse({ status: 200, description: "내 맛집 리스트 정보 요청 성공" })
  @ApiResponse({ status: 401, description: "인증 실패" })
  async getMyWishRestaurantListInfo(@GetUser() tokenInfo: TokenInfo) {
    return await this.userService.getMyWishRestaurantListInfo(tokenInfo);
  }

  @ApiTags("Follow/Following", "Home")
  @Get("follow-list")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "내 팔로우 리스트 정보 가져오기" })
  @ApiResponse({ status: 200, description: "내 팔로우 리스트 정보 요청 성공" })
  @ApiResponse({ status: 401, description: "인증 실패" })
  @ApiResponse({ status: 400, description: "부적절한 요청" })
  async getMyFollowListInfo(@GetUser() tokenInfo: TokenInfo) {
    return await this.userService.getMyFollowListInfo(tokenInfo);
  }

  @ApiTags("Follow/Following")
  @Get("followed-list")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "내 팔로워 리스트 정보 가져오기" })
  @ApiResponse({ status: 200, description: "내 팔로워 리스트 정보 요청 성공" })
  @ApiResponse({ status: 401, description: "인증 실패" })
  @ApiResponse({ status: 400, description: "부적절한 요청" })
  async getMyFollowerListInfo(@GetUser() tokenInfo: TokenInfo) {
    return await this.userService.getMyFollowerListInfo(tokenInfo);
  }

  @ApiTags("Follow/Following")
  @Get("recommended")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "추천 사용자 정보 가져오기" })
  @ApiResponse({ status: 200, description: "추천 사용자 정보 요청 성공" })
  @ApiResponse({ status: 401, description: "인증 실패" })
  async getRecommendUserListInfo(@GetUser() tokenInfo: TokenInfo) {
    return await this.userService.getRecommendUserListInfo(tokenInfo);
  }

  @ApiTags("Signup")
  @Post()
  @ApiOperation({ summary: "유저 회원가입" })
  @ApiResponse({ status: 200, description: "회원가입 성공" })
  @ApiResponse({ status: 400, description: "부적절한 요청" })
  @UsePipes(new ValidationPipe())
  async singup(@Body() userInfoDto: UserInfoDto) {
    return await this.userService.signup(userInfoDto);
  }

  @ApiTags("Follow/Following")
  @Post("follow-list/:nickName")
  @ApiParam({
    name: "nickName",
    required: true,
    description: "팔로우 할 유저의 닉네임",
    type: String,
  })
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "유저 팔로우 하기" })
  @ApiResponse({ status: 200, description: "유저 팔로우 성공" })
  @ApiResponse({ status: 400, description: "부적절한 요청" })
  @ApiResponse({ status: 401, description: "인증 실패" })
  @UsePipes(new ValidationPipe())
  async followUser(
    @GetUser() tokenInfo: TokenInfo,
    @Param("nickName") nickName: string
  ) {
    return await this.userService.followUser(tokenInfo, nickName);
  }

  @ApiTags("RestaurantList")
  @Post("/restaurant/:restaurantid")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "내 맛집 리스트에 등록하기" })
  @ApiParam({
    name: "restaurantid",
    required: true,
    description: "음식점 id",
    type: Number,
  })
  @ApiResponse({ status: 200, description: "맛집리스트 등록 성공" })
  @ApiResponse({ status: 401, description: "인증 실패" })
  @ApiResponse({ status: 400, description: "부적절한 요청" })
  @UsePipes(new ValidationPipe())
  async addRestaurantToNebob(
    @Body() reviewInfoDto: ReviewInfoDto,
    @GetUser() tokenInfo: TokenInfo,
    @Param("restaurantid") restaurantid: number
  ) {
    return await this.userService.addRestaurantToNebob(
      reviewInfoDto,
      tokenInfo,
      restaurantid
    );
  }

  @ApiTags("RestaurantList")
  @Delete("/restaurant/:restaurantid")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "내 맛집 리스트에서 삭제하기" })
  @ApiResponse({ status: 200, description: "맛집리스트 삭제 성공" })
  @ApiResponse({ status: 401, description: "인증 실패" })
  @ApiResponse({ status: 400, description: "부적절한 요청" })
  async deleteRestaurantFromNebob(
    @GetUser() tokenInfo: TokenInfo,
    @Param("restaurantid") restaurantid: number
  ) {
    return await this.userService.deleteRestaurantFromNebob(
      tokenInfo,
      restaurantid
    );
  }

  @ApiTags("WishRestaurantList")
  @Post("/wish-restaurant/:restaurantid")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "내 위시 맛집 리스트에 등록하기" })
  @ApiParam({
    name: "restaurantid",
    required: true,
    description: "음식점 id",
    type: Number,
  })
  @ApiResponse({ status: 200, description: "위시 맛집리스트 등록 성공" })
  @ApiResponse({ status: 401, description: "인증 실패" })
  @ApiResponse({ status: 400, description: "부적절한 요청" })
  async addRestaurantToWishNebob(
    @GetUser() tokenInfo: TokenInfo,
    @Param("restaurantid") restaurantid: number
  ) {
    return await this.userService.addRestaurantToWishNebob(
      tokenInfo,
      restaurantid
    );
  }

  @ApiTags("WishRestaurantList")
  @Delete("/wish-restaurant/:restaurantid")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "내 위시 맛집 리스트에서 삭제하기" })
  @ApiResponse({ status: 200, description: "위시 맛집리스트 삭제 성공" })
  @ApiResponse({ status: 401, description: "인증 실패" })
  @ApiResponse({ status: 400, description: "부적절한 요청" })
  async deleteRestaurantFromWishNebob(
    @GetUser() tokenInfo: TokenInfo,
    @Param("restaurantid") restaurantid: number
  ) {
    return await this.userService.deleteRestaurantFromWishNebob(
      tokenInfo,
      restaurantid
    );
  }

  @ApiTags("Mypage")
  @Post("logout")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "유저 로그아웃" })
  @ApiResponse({ status: 200, description: "로그아웃 성공" })
  @ApiResponse({ status: 401, description: "인증 실패" })
  async logout(@GetUser() tokenInfo: TokenInfo) {
    return await this.userService.logout(tokenInfo);
  }

  @ApiTags("Mypage")
  @Delete()
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "유저 회원탈퇴" })
  @ApiResponse({ status: 200, description: "회원탈퇴 성공" })
  @ApiResponse({ status: 401, description: "인증 실패" })
  @ApiResponse({ status: 400, description: "부적절한 요청" })
  @UsePipes(new ValidationPipe())
  async deleteUserAccount(@GetUser() tokenInfo: TokenInfo) {
    return await this.userService.deleteUserAccount(tokenInfo);
  }

  @ApiTags("Follow/Following")
  @Delete("follow-list/:nickName")
  @ApiParam({
    name: "nickName",
    required: true,
    description: "언팔로우 할 유저의 닉네임",
    type: String,
  })
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "유저 언팔로우 하기" })
  @ApiResponse({ status: 200, description: "유저 언팔로우 성공" })
  @ApiResponse({ status: 400, description: "부적절한 요청" })
  @ApiResponse({ status: 401, description: "인증 실패" })
  @UsePipes(new ValidationPipe())
  async unfollowUser(
    @GetUser() tokenInfo: TokenInfo,
    @Param("nickName") nickName: string
  ) {
    return await this.userService.unfollowUser(tokenInfo, nickName);
  }

  @ApiTags("Mypage")
  @Put()
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "유저 회원정보 수정" })
  @ApiResponse({ status: 200, description: "회원정보 수정 성공" })
  @ApiResponse({ status: 401, description: "인증 실패" })
  @ApiResponse({ status: 400, description: "부적절한 요청" })
  @UsePipes(new ValidationPipe())
  async updateMypageUserInfo(
    @GetUser() tokenInfo: TokenInfo,
    @Body() userInfoDto: UserInfoDto
  ) {
    return await this.userService.updateMypageUserInfo(tokenInfo, userInfoDto);
  }
}