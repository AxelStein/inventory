import type {AxiosInstance} from "axios";
import type {UserApiModel} from "./user.api.model";
import {BaseRepository} from "../base.repository";
import apiClient from "../api.client";

class AdminUserRepository extends BaseRepository {

    constructor() {
        super(apiClient, '/admin/user');
    }

    getUsers = () => this.get<UserApiModel[]>('/list')

}

export default new AdminUserRepository();