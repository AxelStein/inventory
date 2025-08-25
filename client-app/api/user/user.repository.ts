import type {AxiosInstance} from "axios";
import type {UserApiModel} from "./user.api.model";
import {BaseRepository} from "../base.repository";
import apiClient from "../api.client";

class UserRepository extends BaseRepository {

    constructor() {
        super(apiClient, '/member/user');
    }

    getUsers = () => this.get<UserApiModel[]>('/list')

}

export default new UserRepository();