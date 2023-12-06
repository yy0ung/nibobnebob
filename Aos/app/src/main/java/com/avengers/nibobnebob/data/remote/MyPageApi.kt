package com.avengers.nibobnebob.data.remote

import com.avengers.nibobnebob.data.model.response.BaseResponse
import com.avengers.nibobnebob.data.model.response.MyDefaultInfoResponse
import com.avengers.nibobnebob.data.model.response.MyInfoResponse
import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.Response
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.Multipart
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Part

interface MyPageApi {
    @GET("api/user/details")
    suspend fun getMyInfo(): Response<BaseResponse<MyInfoResponse>>

    @GET("api/user")
    suspend fun getMyDefaultInfo(): Response<BaseResponse<MyDefaultInfoResponse>>

    @Multipart
    @PUT("api/user")
    suspend fun editMyInfo(
        @Part("email") email: RequestBody,
        @Part("provider") provider: RequestBody,
        @Part("nickName") nickName: RequestBody,
        @Part("region") region: RequestBody,
        @Part("birthdate") birthdate: RequestBody,
        @Part("isMale") isMale: Boolean,
        @Part("password") password: RequestBody?,
        @Part profileImage: MultipartBody.Part?
    ): Response<Unit>

    @POST("api/user/logout")
    suspend fun logout(): Response<Unit>

    @DELETE("api/user")
    suspend fun withdraw(): Response<Unit>

}