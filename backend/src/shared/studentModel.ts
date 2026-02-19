import { DataTypes, Model, Optional } from "sequelize";

// Define the attributes for the Student model
export interface StudentAttributes {
  StudentId: number;
  FirstName: string;
  LastName: string;
  School: string;
}

// Define the optional attributes for creating a Student
export interface StudentCreationAttributes extends Optional<StudentAttributes, "StudentId"> {}

// Define the Student model class
export class Student extends Model<StudentAttributes, StudentCreationAttributes> implements StudentAttributes {
  public StudentId!: number;
  public FirstName!: string;
  public LastName!: string;
  public School!: string;
}

// Initialize the Student model
export const StudentModel = {
  StudentId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  FirstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  LastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  School: {
    type: DataTypes.STRING,
    allowNull: false
  }
};
