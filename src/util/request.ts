import { post,get, put,rDelete } from './service';

export const loginApi = (data:any)=>{
  return post ({
    url:'/login',
    data
  })
}

export const getUserListApi = (data:any)=>{
  return get ({
    url:'/users',
    data
  })
}

export const getTaskListApi = (data:any)=>{
  return get ({
    url:'/mytables',
    data
  })
}

export const userAddApi = (data:any)=>{
  return post ({
    url:'/users',
    data
  })
}

//更改是否可用
export const changeUserStateApi = (data:any)=>{
  return put ({
    url:`/users/${data.id}uId/state/${data.mg_state}`,
    data
  })
}


export const UserChangeByIdApi = (data:any)=>{
  return put ({
    url:`/users/${data.id}`,
    data
  })
}

export const taskFindById = (data:any)=>{
  return get ({
    url:`/mytables/${data}`,

  })
}

export const deleteUserByIdApi = (data:any)=>{
  return rDelete ({
    url:`/users/${data.id}`,
    data
  })
}

export const getRolesListApi = (data:any)=>{
  return get ({
    url:'/roles',
    data
  })
}
export const DeleteAndDropTaskTableById = (data:any)=>{
  return rDelete ({
    url:`/mytables/${data}`,
    data
  })
}

export const rolesAddApi = (data:any)=>{
  return post ({
    url:'/roles',
    data
  })
}

export const createTableApi = (data:any)=>{
  return post ({
    url:'/mytables',
    data
  })
}
export const getChildTableByIdAllApi= (id:Int16Array,data:any)=>{
  return get ({
    url:`/mytables/${id}/child`,
    id,data  
  })
}

export const getChildTableByIdInfoApi= (id:Int16Array)=>{
  return get ({
    url:`/mytables/${id}/child/info`,
    id
  })
}

export const updateChildTableByTaskIdApi= (data:any)=>{
  return put ({
    url:`/mytables/child`,
    data  
  })
}

export const saveChildByTaskApi= (data:any)=>{
  return post ({
    url:`/mytables/child`,
    data  
  })
}


export const rolesChangeByIdApi = (data:any)=>{
  return put ({
    url:`/roles/${data.id}`,
    data
  })
}


export const rolesDelByIdApi = (data:any)=>{
  return rDelete ({
    url:`/roles/${data.id}`,
    data
  })
}


export const getGoodsListApi = (data:any)=>{
  return get ({
    url:`/goods`,
    data
  })
}
