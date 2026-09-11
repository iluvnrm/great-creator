from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Role
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class RoleRequest(BaseModel):
    name: str
    color: str = "#000000"
    permissions: int = 0
    mentionable: bool = False
    hoist: bool = False

class RoleResponse(BaseModel):
    id: int
    role_id: int
    guild_id: int
    name: str
    color: str
    permissions: int
    position: int
    mentionable: bool
    hoist: bool
    
    class Config:
        from_attributes = True

@router.get("/guild/{guild_id}")
async def get_guild_roles(guild_id: int, db: Session = Depends(get_db)):
    """Get all roles for a guild"""
    roles = db.query(Role).filter(Role.guild_id == guild_id).order_by(Role.position.desc()).all()
    return roles

@router.post("/")
async def create_role(guild_id: int, role_data: RoleRequest, db: Session = Depends(get_db)):
    """Create a new role"""
    new_role = Role(
        guild_id=guild_id,
        role_id=int(datetime.utcnow().timestamp()),
        name=role_data.name,
        color=role_data.color,
        permissions=role_data.permissions,
        mentionable=role_data.mentionable,
        hoist=role_data.hoist
    )
    
    db.add(new_role)
    db.commit()
    db.refresh(new_role)
    
    return new_role

@router.put("/{role_id}")
async def update_role(role_id: int, role_data: RoleRequest, db: Session = Depends(get_db)):
    """Update a role"""
    role = db.query(Role).filter(Role.role_id == role_id).first()
    
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Role not found"
        )
    
    role.name = role_data.name
    role.color = role_data.color
    role.permissions = role_data.permissions
    role.mentionable = role_data.mentionable
    role.hoist = role_data.hoist
    
    db.commit()
    db.refresh(role)
    
    return role

@router.delete("/{role_id}")
async def delete_role(role_id: int, db: Session = Depends(get_db)):
    """Delete a role"""
    role = db.query(Role).filter(Role.role_id == role_id).first()
    
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Role not found"
        )
    
    db.delete(role)
    db.commit()
    
    return {"message": "Role deleted successfully"}
